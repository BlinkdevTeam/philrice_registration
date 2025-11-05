export type WalkinForm = {
  id?: number; // Auto-generated from backend
  unique_code?: string; // Auto-generated unique ID

  // Basic Information
  email: string;
  isPhilriceEmp: "Yes" | "No";
  firstName: string;
  midName: string;
  lastName: string;
  extName: string;
  sex: string;
  ageBracket: "30 y/o and below" | "31-45 y/o" | "46-59 y/o" | "60 y/o and above" | "" ;
  isIndigenous: "Yes" | "No";
  indigenousGroup: string;
  withDisability: "Yes" | "No";
  disability: string;
  contactNo: string;

  // PhilRice-specific info
  philriceName?: string;
  philriceStation?: string;
  philriceUnit?: string;

  // Non-PhilRice (external) participants
  affiliationName?: string;

  inserted_at?: string; // Optional timestamp
};
