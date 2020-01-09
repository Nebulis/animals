import React, { useEffect, useState } from "react";
import { CountryPath, World } from "./world/country";
import { Country } from "./world/type";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Animal, animalsDatabase } from "./firebase";

const classes = ["Mammifères", "Mammifères Marins", "Oiseaux", "Reptiles"];
const families = ["Canidés", "Félidés"];
const countriesSet = new Map<string, Set<Country>>();
countriesSet.set(
  "Afrique Australe",
  new Set<Country>(["South Africa", "Botswana", "Swaziland", "Lesotho", "Namibia", "Zimbabwe"])
);
countriesSet.set(
  "Afrique Centrale",
  new Set<Country>(["Angola", "Burundi", "Congo, The Democratic Republic of the", "Congo", "Gabon"])
);

const style = css`
  .highlight {
    fill: teal;
    filter: grayscale(0.2);
  }
`;
export const AddAnimal: React.FunctionComponent = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [clazz, setClazz] = useState("");
  const [family, setFamily] = useState("");
  const [countries, setCountries] = useState<Set<Country>>(new Set());
  const [hover, setHover] = useState<Country | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();
  const [animals, setAnimals] = useState<Animal[]>([]);

  // TODO make sure to load once
  // load animals
  useEffect(() => {
    animalsDatabase.get().then(snapshot => {
      setAnimals(
        // @ts-ignore
        snapshot.docs.map(d => {
          return {
            ...d.data(),
            id: d.id
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (selectedAnimal) {
      setId(selectedAnimal.id);
      setName(selectedAnimal.name);
      setCountries(new Set(selectedAnimal.countries));
      setClazz(selectedAnimal.clazz);
      setFamily(selectedAnimal.family);
    } else {
      reset();
    }
  }, [selectedAnimal]);

  const reset = () => {
    setSelectedAnimal(undefined); // TODO this does not work :)
    setId("");
    setName("");
    setClazz("");
    setFamily("");
    setCountries(new Set());
  };

  const formValid = name && clazz && countries.size > 1;
  return (
    <div className="md:flex" css={style}>
      <div className="md:w-3/4">
        <World
          onClick={country => {
            if (countries.has(country["data-name"])) {
              countries.delete(country["data-name"]);
              setCountries(new Set(countries));
            } else {
              countries.add(country["data-name"]);
              setCountries(new Set(countries));
            }
          }}
          onMouseEnter={country => setHover(country["data-name"])}
          onMouseLeave={_ => setHover(undefined)}
          transform={country => {
            if (countries.has(country["data-name"])) {
              return <CountryPath country={country} className="highlight cursor-pointer" />;
            } else if (country["data-name"] === hover) {
              return <CountryPath country={country} className="cursor-pointer fill-current text-gray-500" />;
            }
            return <CountryPath country={country} className="cursor-pointer" />;
          }}
        />
      </div>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 md:w-1/4">
        <div className="flex justify-center mb-3">
          <button
            disabled={!formValid || isSaving}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2 ${
              !formValid || isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              setIsSaving(true);
              if (id) {
                animalsDatabase
                  .doc(id)
                  .set({
                    name,
                    family,
                    clazz,
                    countries: [...countries]
                  })
                  .then(() => {
                    reset();
                    setIsSaving(false);
                  })
                  .catch(error => {
                    console.error(error);
                    setIsSaving(false);
                  });
              } else {
                animalsDatabase
                  .add({
                    name,
                    family,
                    clazz,
                    countries: [...countries]
                  })
                  .then(() => {
                    reset();
                    setIsSaving(false);
                  })
                  .catch(error => {
                    console.error(error);
                    setIsSaving(false);
                  });
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="fill-current w-4 h-4 mr-2">
              <path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z" />
            </svg>
            {isSaving ? "Saving..." : id ? "Update" : "Create"}
          </button>
        </div>
        <div className="inline-block relative w-full mb-3 max-w-xl">
          <select
            className="bg-gray-200 block appearance-none border-2 border-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500 w-full"
            value={selectedAnimal?.name}
            onChange={event => {
              setSelectedAnimal(animals.find(a => a.name === event.target.value));
            }}
          >
            <option value="">Sélectionner un animal a editer</option>
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
        <div className="mb-3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="inline-block relative w-full mb-3">
          <select
            className="bg-gray-200 block appearance-none border-2 w-full border-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
            value={clazz}
            onChange={event => setClazz(event.target.value)}
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((c, id) => (
              <option key={id} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div className="inline-block relative w-full mb-3">
          <select
            className="bg-gray-200 block appearance-none border-2 w-full border-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
            value={family}
            onChange={event => setFamily(event.target.value)}
          >
            <option value="">Sélectionner une famille</option>
            {families.map((f, id) => (
              <option key={id} value={f}>
                {f}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div className="font-bold mb-2">Pays</div>
        <div>
          {[...countries].map(country => {
            return (
              <button
                className="bg-teal-500 hover:bg-teal-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2 mb-2"
                key={country}
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();

                  countries.delete(country);
                  setCountries(new Set(countries));
                }}
              >
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <polygon points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644" />
                </svg>
                {country}
              </button>
            );
          })}
          {[...countriesSet.entries()]
            .filter(value => {
              return ![...value[1]].every(c => countries.has(c));
            })
            .map((value, index) => {
              return (
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2 mb-2"
                  key={index}
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    for (const c of value[1]) {
                      countries.add(c);
                    }
                    setCountries(new Set(countries));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="fill-current w-4 h-4 mr-2">
                    <path
                      fill="currentColor"
                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                    />
                  </svg>
                  {value[0]}
                </button>
              );
            })}
        </div>
      </form>
    </div>
  );
};
