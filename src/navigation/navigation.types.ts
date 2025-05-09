import { TemplateResult } from "lit";

export interface PageComponentInterface {
  OnPageLoad?: () => Promise<boolean>;
  setProps?: (props: Record<string, any>) => void;
}

export type NavigationItem<T extends PageComponentInterface> = {
  URLKey: string;
  Name: string;
  TemplateLiteral?: TemplateResult;
  PageComponent?: new () => T; // Component class constructor
  LoadProps?: () => Record<string, any>;
};
