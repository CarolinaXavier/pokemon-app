import { PokemonInterface } from "./Pokemon.interface";

export interface PokemonsResultInterface {
    coun: number;
    next: string;
    previous: undefined;
    results: PokemonInterface[];
}