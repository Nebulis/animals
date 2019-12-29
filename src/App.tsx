import React, { useState } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { CountryPath, World } from "./world/country";
import { Country } from "./world/type";

interface Animal {
  name: string;
  countries: Country[];
}

const tiger: Animal = {
  name: "Tiger",
  countries: ["India", "Myanmar", "Nepal", "Bhutan"]
};

const elephant: Animal = {
  name: "Elephant",
  countries: [
    "Angola",
    "Burundi",
    "Congo",
    "Congo, The Democratic Republic of the",
    "Gabon",
    "Equatorial Guinea",
    "Uganda",
    "Rwanda",
    "Zambia",
    "Djibouti",
    "Eritrea",
    "Ethiopia",
    "Kenya",
    "Malawi",
    "Mozambique",
    "Somalia",
    "Tanzania, United Republic of",
    "South Africa",
    "Botswana",
    "Swaziland",
    "Lesotho",
    "Namibia",
    "Zimbabwe",
    "Benin",
    "Burkina Faso",
    "Cameroon",
    "Cote D'Ivoire",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Liberia",
    "Nigeria",
    "Senegal",
    "Sierra Leone",
    "Togo"
  ]
};

const style = css`
  label {
    cursor: pointer;
  }
  .animals {
    font-size: 1.5rem;
    margin-top: 1rem;
    text-align: center;
  }
  .highlight {
    fill: red;
  }
`;

const App: React.FC = () => {
  const [animal, setAnimal] = useState<Animal | undefined>(elephant);
  return (
    <div css={style}>
      <div className="animals">
        <label>
          <input type="radio" name="animal" onClick={() => setAnimal(undefined)} id="none" checked={!animal} />
          None
        </label>
        <label>
          <input
            type="radio"
            name="animal"
            onClick={() => setAnimal(elephant)}
            id="none"
            checked={animal && animal.name === "Elephant"}
          />
          Elephant
        </label>
        <label>
          <input
            type="radio"
            name="animal"
            onClick={() => setAnimal(tiger)}
            id="none"
            checked={animal && animal.name === "Tiger"}
          />
          Tiger
        </label>
      </div>
      <World
        transform={country => {
          if (animal && animal.countries.includes(country["data-name"])) {
            return <CountryPath country={country} className="highlight" />;
          }
          return <CountryPath country={country} />;
        }}
      />
    </div>
  );
};

export default App;
