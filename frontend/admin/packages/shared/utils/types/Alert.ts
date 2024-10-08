import * as Icons from "@heroicons/react/24/outline";


export interface tAlert {
  id: string;
  title: string;
  message: string;
  buttonText: string;
  iconName: keyof typeof Icons;
  type: tAlertType;
}

export enum tAlertType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}