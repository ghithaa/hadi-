export interface Plan {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  tasks: PlanTask[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  frequency?: string;
  priority?: string;
}

export interface GeneratePlanPayload {
  questionnaireData: Record<string, any>;
}
