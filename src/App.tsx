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
import { useEffect, useState } from "react";
import { PokemonInterface } from "./interfaces/Pokemon.interface";
import { Search } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { FilterPokemons } from "./utils/FilterPokemons.util";
import { BackgroundColor } from "./utils/BackgroundColor.util";

type inputs = {
    name: string;
};

export default function App() {
    const { data, isLoading, isError } = useQuery({
        queryKey: "pokemon",
        queryFn: getPokemons,
    });

    const [filteredPokemons, setFilteredPokemons] =
        useState<PokemonInterface[]>();
    const [isSearch, setIsSearch] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setFilteredPokemons(data);
            console.log(data);
        }

        const handleKeyPress = (event: any) => {
            const searchInput = document.getElementById("searchInput");
            if ((event.ctrlKey || event.metaKey) && event.key === "/") {
                event.preventDefault();
                searchInput?.focus();
            }
        };

        const handleKeyDown = (event: any) => {
            const searchInput = document.getElementById("searchInput");
            const firstPokemon = document.getElementById("table_row_0");
            if (event.key === "ArrowDown" && document.activeElement === searchInput) {
                event.preventDefault();
                if (firstPokemon) {
                    firstPokemon.focus();
                }
            }
        };
        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [data]);

    const debounced = useDebouncedCallback((value: string) => {
        setIsSearch(true);
        if (data) {
            FilterPokemons(data, value).then((filteredPokemons) => {
                setFilteredPokemons(filteredPokemons);
                setIsSearch(false);
            });
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

    if (data) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <div
                    onChange={handleSubmit(onSubmit)}
                    className="flex w-full max-w-lg items-center space-x-2 mb-12"
                >
                    <Input
                        id="searchInput"
                        type="text"
                        placeholder="Pesquise pelo nome"
                        {...register("name", { required: false })}
                    ></Input>
                    <Search className="w-3 h-3 mr-2" />
                </div>

                {isSearch ? (
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <p>Pesquisando...</p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        {filteredPokemons && filteredPokemons.length ? (
                            <TableBody>
                                {filteredPokemons.map((pokemon: any, index: number) => {
                                    return (
                                        <TableRow
                                            className="border-0 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                            key={index}
                                            id={"table_row_" + index}
                                            tabIndex={0}
                                            onMouseEnter={() => console.log('table_row_'+index)}
                                            onMouseLeave={() => { }}
                                        >
                                            <TableCell className="rounded-md">
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
                                                                                className="mr-2 mb-2 md:mb-0 text-xs capitalize"
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
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {filteredPokemons === undefined ? (
                                            <p>Carregando pokemons...</p>
                                        ) : (
                                            <p>Nenhum pokemon encontrado!</p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                )}
            </div>
        );
    }
}
