import { PokemonInterface } from "@/interfaces/Pokemon.interface";

export function FilterPokemons(
    data: PokemonInterface[],
    value: string
): Promise<PokemonInterface[]> {
    const filterPromise = new Promise((resolve) => {
        const filteredPokemons = data.filter((pokemon) =>
            pokemon.name.includes(value.toLocaleLowerCase())
        );
        resolve(filteredPokemons);
    });

    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Tempo mínimo de espera atingido");
        }, 500);
    });

    return Promise.all([filterPromise, timeoutPromise]).then((results) => {
        return results[0] as PokemonInterface[];
    });
}
