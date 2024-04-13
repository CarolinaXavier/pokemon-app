import { Table, TableBody, TableCell, TableRow } from "./components/ui/table";
import "./globals.css";
import { useQuery } from "react-query";
import { LoadingComponent } from "./LoadingComponent";
import { ErrorComponent } from "./ErrorComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { getPokemons } from "./api/AxiosClient";
import { Input } from "./components/ui/input";
import { Initials } from "./utils/Initials.util";
import { BackgroundColor } from "./utils/BackgroundColor.util";
import { useEffect, useState } from "react";
import { PokemonInterface } from "./interfaces/Pokemon.interface";
import { Search } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

type inputs = {
    name: string;
};

export default function App() {
    const { data, isLoading, isError } = useQuery({
        queryKey: "pokemon",
        queryFn: getPokemons,
    });

    const [filteredPokemons, setFilteredPokemons] = useState<PokemonInterface[]>(
        []
    );

    useEffect(() => {
        if (data) {
            setFilteredPokemons(data);
        }
    }, [data]);

    const debounced = useDebouncedCallback((value) => {
        if (data) {
            const filteredPokemons = data.filter((pokemon) =>
                pokemon.name.includes(value)
            );
            setFilteredPokemons(filteredPokemons);
        }
    }, 500);

    const { register, handleSubmit } = useForm<inputs>();

    const onSubmit: SubmitHandler<inputs> = async (value) => {
        debounced(value.name);
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (isError) {
        return <ErrorComponent />;
    }

    if (filteredPokemons) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <div
                    onChange={handleSubmit(onSubmit)}
                    className="flex w-full max-w-lg items-center space-x-2 mb-12"
                >
                    <Input
                        type="text"
                        placeholder="Pesquise pelo nome"
                        {...register("name", { required: false })}
                    ></Input>
                    <Search className="w-3 h-3 mr-2" />
                </div>

                <Table>
                    <TableBody>
                        {filteredPokemons.map((pokemon: any, index: number) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Avatar className="flex">
                                            <AvatarImage
                                                src={pokemon.details.sprites.back_default}
                                                alt={pokemon.name + " avatar"}
                                                className="w-12 h-12 rounded-full mr-4 bg-secondary"
                                            />
                                            <AvatarFallback>
                                                <div
                                                    className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${BackgroundColor()}`}
                                                >
                                                    <span className="text-white text-lg font-bold">
                                                        {Initials(pokemon.name)}
                                                    </span>
                                                </div>
                                            </AvatarFallback>
                                            <div>
                                                <h4 className="text-lg capitalize">
                                                    {pokemon.name.replaceAll("-", " ")}
                                                </h4>
                                                <div className="flex flex-wrap">
                                                    {pokemon.details.abilities.map(
                                                        (abilityObject: any, index: number) => {
                                                            return (
                                                                <div key={index}>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="mr-2 capitalize"
                                                                    >
                                                                        {abilityObject.ability.name.replaceAll(
                                                                            "-",
                                                                            " "
                                                                        )}
                                                                    </Badge>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </Avatar>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
