export interface Helpline {
  title: string;
  number: string;
  description: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  type: string;
  contact?: string;
  location?: string;
}
