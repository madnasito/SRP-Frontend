import { Component } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  sections: FaqSection[] = [
    {
      title: 'Sobre tu Proceso de Sanidad (Fase S-R)',
      items: [
        {
          question: '¿Qué debo hacer si durante el módulo "Sana con Papá" me siento muy removida emocionalmente?',
          answer: 'Es normal y es parte de la limpieza. Te recomendamos llevar un diario de oración, permitirte sentir y recordar que Jesucristo, el Capitán de tu barco, está contigo en esa tormenta. Si necesitas apoyo extra, escríbenos al canal de soporte emocional del grupo.'
        },
        {
          question: '¿Puedo repetir los ejercicios de reprogramación mental varias veces?',
          answer: '¡Totalmente! La mente se reprograma por repetición e impacto emocional. Te sugerimos escuchar tus afirmaciones SRP diariamente, especialmente al despertar y antes de dormir.'
        },
        {
          question: '¿Cómo sé si ya he sanado un área de mi vida para pasar al bloque de Producción?',
          answer: 'La sanidad no es ausencia de recuerdo, sino ausencia de dolor paralizante. Sabrás que estás lista cuando puedas hablar de tu pasado como una lección y no como un ancla que te impide soñar con tu negocio.'
        }
      ]
    },
    {
      title: 'Sobre la Metodología y Clases',
      items: [
        {
          question: '¿Dónde encuentro los enlaces para las mentorías en vivo vía Zoom?',
          answer: 'Todos los enlaces se publican con 24 horas de antelación en la sección "Calendario de Clases" de esta plataforma y también se envían por nuestro grupo exclusivo de WhatsApp.'
        },
        {
          question: '¿Qué pasa si me pierdo una clase en vivo?',
          answer: 'Las grabaciones se suben a esta plataforma en un máximo de 48 horas después de la sesión. Podrás verlas en la sección de "Grabaciones de Mentoría".'
        },
        {
          question: '¿Cómo puedo hacer preguntas específicas sobre mi caso personal?',
          answer: 'Utiliza las sesiones de "Preguntas y Respuestas" en vivo o deja tu comentario debajo del video del módulo correspondiente aquí en la plataforma.'
        }
      ]
    },
    {
      title: 'Sobre la Ejecución Estratégica (Fase P)',
      items: [
        {
          question: 'Me siento abrumada con la parte técnica del negocio digital, ¿qué hago?',
          answer: 'Respira. El método R3F está diseñado para ir paso a paso. No intentes construir el edificio en un día. Enfócate en terminar un módulo a la vez y usa las guías descargables que hemos preparado para ti.'
        },
        {
          question: '¿Cuándo es el momento ideal para lanzar mi primer producto digital?',
          answer: 'Al finalizar la Fase 3 (Producción). Allí habrás definido tu meta y tu estrategia de ventas. No te adelantes al proceso; el orden trae bendición.'
        },
        {
          question: '¿Puedo compartir mis ideas de negocio en el grupo para recibir feedback?',
          answer: 'Sí, el grupo de alumnas es un espacio seguro para el crecimiento mutuo. Recuerda siempre hacerlo bajo las normas de respeto y blindaje que aceptaste al entrar.'
        }
      ]
    },
    {
      title: 'Administración y Permanencia',
      items: [
        {
          question: '¿Por cuánto tiempo tendré acceso a los materiales de la Academia?',
          answer: 'Tienes acceso por [indicar tiempo, ej. 1 año], lo que te permite repasar los módulos y las grabaciones de las mentorías cuantas veces necesites.'
        },
        {
          question: '¿Puedo descargar los videos para verlos sin internet?',
          answer: 'Los videos están protegidos para garantizar el blindaje de la Academia, pero puedes descargar todas las guías en PDF y los audios de afirmaciones para escucharlos donde quieras.'
        },
        {
          question: '¿Qué hago si tengo problemas técnicos para entrar a la plataforma?',
          answer: 'Envía un mensaje directo a nuestro soporte técnico a través del botón de WhatsApp que ves en la esquina inferior derecha de esta área de alumnas.'
        },
        {
          question: '¿Cómo puedo invitar a otra mujer a la Academia?',
          answer: '¡Nos encanta expandir el Reino! Escríbenos por privado para darte un enlace especial de invitación para que otras mujeres también vivan su metamorfosis.'
        },
        {
          question: '¿Existen niveles avanzados después de terminar estas fases?',
          answer: 'Sí, la Academia SRP es un camino de crecimiento constante. Al finalizar, se te informará sobre los grupos de Mastermind para mentoría avanzada.'
        },
        {
          question: '¿Cuál es la regla de oro para tener éxito en esta Academia?',
          answer: 'La Persistencia y la Obediencia al proceso. No te saltes pasos, confía en el diseño que Dios nos dio para ti y mantén tu fe activa.'
        }
      ]
    }
  ];
}
