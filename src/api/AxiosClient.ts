import axios, { AxiosResponse } from "axios";
import { PokemonsResultInterface } from "../interfaces/Pokemons-result.interface";
import { PokemonInterface } from "../interfaces/Pokemon.interface";

const client = axios.create({
    baseURL: "https://pokeapi.co/api/v2/",
});

export const AxiosClient = async (options: any) => {
    const onSuccess = async (response: AxiosResponse<PokemonsResultInterface, any>) => {
        const pokemons = response.data.results;
        const pokemonDetailPromises = pokemons.map(async (pokemon: PokemonInterface) => {
            const pokemonDetailResponse = await axios.get(pokemon.url);
            const { abilities, sprites } = pokemonDetailResponse.data;
            return { ...pokemon, details: { abilities, sprites } };
        });
        const pokemonsWithDetails = await Promise.all(pokemonDetailPromises);
        return pokemonsWithDetails;
    };

    const onError = (error: any) => {
        return Promise.reject(error.response?.data);
    };

    return client(options).then(onSuccess).catch(onError);
};

export const getPokemons = () =>
    AxiosClient({
        url: `/pokemon?limit=100000&offset=0`,
        method: "GET",
    });

