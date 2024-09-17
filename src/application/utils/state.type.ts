// export type TaskStatus = 'en progreso' | 'completado' | 'pendiente';

export const TaskStatus = {
  EN_PROGRESO: 'en progreso' as const,
  COMPLETADO: 'completado' as const,
  PENDIENTE: 'pendiente' as const
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
