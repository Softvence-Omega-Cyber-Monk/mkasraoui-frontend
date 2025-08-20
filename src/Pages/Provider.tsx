import Header from "@/components/Provider/Header";
import ProviderDirectory from "@/components/Provider/ProviderDirectory";
import React from "react";

const Provider: React.FC = () => {
  return (
    <div className="mx-auto w-full">
      <Header />
      <ProviderDirectory />
    </div>
  );
};

export default Provider;
