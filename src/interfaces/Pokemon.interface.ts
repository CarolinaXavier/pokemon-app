import { AbilityInterface } from "./Ability.interface";

export interface PokemonInterface {
    name: string;
    url: string;
    details: {
        abilities: [
            {
                ability: AbilityInterface;
            }
        ];
        sprites: {
            back_default: string;
        };
    };
}
