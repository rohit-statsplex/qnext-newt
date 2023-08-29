import React, { createContext, useContext, useState } from "react";
import {
  defaultGenerated,
  type Generated,
} from "~/components/NewsletterLiveForm/schemas";

type GeneratedContextType = {
  generated: Generated;
  setGenerated: React.Dispatch<React.SetStateAction<Generated>>;
};

const GeneratedContext = createContext<GeneratedContextType | undefined>(
  undefined
);

type GeneratedProviderProps = {
  children: React.ReactNode;
};

const GeneratedProvider: React.FC<GeneratedProviderProps> = ({ children }) => {
  const [generated, setGenerated] = useState<Generated>(defaultGenerated);

  return (
    <GeneratedContext.Provider value={{ generated, setGenerated }}>
      {children}
    </GeneratedContext.Provider>
  );
};

const useGenerated = (): GeneratedContextType => {
  const context = useContext(GeneratedContext);
  if (!context) {
    throw new Error("useGenerated must be used within a GeneratedProvider");
  }
  return context;
};

export { GeneratedProvider, useGenerated };
