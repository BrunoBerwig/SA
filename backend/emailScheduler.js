const cron = require('node-cron');
const nodemailer = require('nodemailer');
const pool = require('./config/database');

// --- Configuração do Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Função para buscar consultas e enviar e-mails ---
async function verificarEEnviarEmailsDeConsulta() {
  console.log(`[${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}] Verificando consultas para o dia seguinte...`);

  try {
    const hojeEmSaoPaulo = new Date();
    const fusoHorarioSP = 'America/Sao_Paulo';
    
    const hoje = new Date(hojeEmSaoPaulo.toLocaleString('en-US', { timeZone: fusoHorarioSP }));
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const depoisDeAmanha = new Date(amanha);
    depoisDeAmanha.setDate(amanha.getDate() + 1);

    console.log(`Buscando consultas entre ${amanha.toISOString()} e ${depoisDeAmanha.toISOString()}`);

    const queryConsultas = `
        SELECT 
            a.id, 
            a.data_hora, 
            p.nome AS paciente_nome, 
            p.email AS paciente_email, -- Certifique-se de que a tabela pacientes tem um campo 'email'
            m.nome AS medico_nome
        FROM 
            agendamentos a
        JOIN 
            pacientes p ON a.paciente_id = p.id
        JOIN
            medicos m ON a.medico_id = m.id
        WHERE 
            a.data_hora >= $1 
            AND a.data_hora < $2
            AND a.status = 'Agendado' -- Apenas consultas agendadas
            AND (a.lembrete_enviado IS NULL OR a.lembrete_enviado = FALSE) -- Que ainda não tiveram lembrete enviado
        ORDER BY 
            a.data_hora ASC;
    `;
    
    const result = await pool.query(queryConsultas, [amanha, depoisDeAmanha]);
    const consultasParaLembrar = result.rows;

    if (consultasParaLembrar.length === 0) {
      console.log('Nenhuma consulta encontrada para lembrete no dia seguinte.');
      return;
    }

    console.log(`Encontradas ${consultasParaLembrar.length} consultas para enviar lembrete.`);

    for (const consulta of consultasParaLembrar) {
      if (!consulta.paciente_email) {
        console.warn(`Paciente ${consulta.paciente_nome} (ID: ${consulta.paciente_id}) não tem e-mail cadastrado. Pulando.`);
        continue;
      }

      const dataFormatada = new Date(consulta.data_hora).toLocaleDateString('pt-BR', { timeZone: fusoHorarioSP });
      const horaFormatada = new Date(consulta.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: fusoHorarioSP });

      const mailOptions = {
        from: process.env.EMAIL_USER || 'seu_email@gmail.com',
        to: consulta.paciente_email,
        subject: `Lembrete: Sua Consulta Agendada com ${consulta.medico_nome}`,
        html: `
          <p>Olá, ${consulta.paciente_nome},</p>
          <p>Este é um lembrete amigável sobre sua consulta agendada:</p>
          <ul>
            <li><strong>Com:</strong> Dr(a). ${consulta.medico_nome}</li>
            <li><strong>Data:</strong> ${dataFormatada}</li>
            <li><strong>Hora:</strong> ${horaFormatada}</li>
          </ul>
          <p>Por favor, chegue alguns minutos antes do horário agendado. Em caso de necessidade de reagendamento ou cancelamento, entre em contato conosco o mais breve possível.</p>
          <p>Aguardamos você!</p>
          <p>Atenciosamente,<br>Sua Clínica</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Lembrete enviado com sucesso para ${consulta.paciente_email} (ID da consulta: ${consulta.id})`);
        
        await pool.query(
          'UPDATE agendamentos SET lembrete_enviado = TRUE WHERE id = $1',
          [consulta.id]
        );
      } catch (emailError) {
        console.error(`Erro ao enviar e-mail para ${consulta.paciente_email} (ID da consulta: ${consulta.id}):`, emailError);
      }
    }

    console.log('Processo de verificação e envio de e-mails concluído.');

  } catch (dbError) {
    console.error('Erro geral no processo de verificação de consultas:', dbError);
  }
}

// --- Agendar a tarefa para rodar a cada 30 minutos ---
// A string '*/30 * * * *' significa: a cada 30 minutos, em todas as horas, todos os dias do mês, todos os meses, todos os dias da semana.
function iniciarAgendadorDeEmails() {
  cron.schedule('*/30 * * * *', () => {
    verificarEEnviarEmailsDeConsulta();
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  });

  console.log('Agendador de e-mails iniciado. Rodará a cada 30 minutos (Horário de São Paulo).');
}

module.exports = iniciarAgendadorDeEmails;