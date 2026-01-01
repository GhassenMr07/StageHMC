export interface CommonProperties {
  resourceName?: {
    name: string;
    nameType: string;
    nameLanguage?: string;
  }[];
  resourceDescription?: string;
  resourceUri?: string[];
  documentationUri?: string[];
  mappingCategory?: string;
  identifier?: {
    id: string;
    identifierType: string;
  }[];
  contact?: {
    contactName?: string;
    contactIdentifier?: string;
    contactIdentifierSystem?: string;
    contactUri?: string;
    contactRole?: string;
  }[];
  keyword?: string[];
  date?: {
    resourceDate: Date;
    dateType: "start date" | "end date" | "modified";
  }[];
  resourceStatus?: "valid" | "invalid" | "uncertain";
  relatedHelmholtzCentre?: {
    helmholtzCentre: string;
    relationType: string;
  }[];
  scientificDiscipline?: string;
  helmholtzResearchField?: string;
}

export interface IPBaseObject extends CommonProperties {
  _id: string;
}
