import React, { useEffect, useState } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { CountryPath, World } from "./world/country";
import { Country } from "./world/type";
import { animalsDatabase } from "./firebase";

interface Animal {
  name: string;
  countries: Country[];
}

const style = css`
  label {
    cursor: pointer;
  }
  .highlight {
    fill: red;
  }
`;

export const Home: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();
  const [animals, setAnimals] = useState<Animal[]>([]);
  useEffect(() => {
    animalsDatabase.get().then(snapshot => {
      // @ts-ignore
      setAnimals(snapshot.docs.map(d => d.data()));
    });
  }, []);
  return (
    <div css={style}>
      <div className="animals mt-4 text-2xl flex justify-center">
        <div className="inline-block relative w-full mb-3 max-w-xl">
          <select
            className="bg-gray-200 block appearance-none border-2 border-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500 w-full"
            value={selectedAnimal?.name}
            onChange={event => {
              setSelectedAnimal(animals.find(a => a.name === event.target.value));
            }}
          >
            <option value="">Sélectionner un animal</option>
            {animals.map((animal, index) => (
              <option key={index} value={animal.name}>
                {animal.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <World
        transform={country => {
          if (selectedAnimal && selectedAnimal.countries.includes(country["data-name"])) {
            return <CountryPath country={country} className="highlight" />;
          }
          return <CountryPath country={country} />;
        }}
      />
    </div>
  );
};
