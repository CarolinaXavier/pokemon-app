import { Label } from "@radix-ui/react-label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import "./globals.css";
import { useQuery } from "react-query";
import { LoadingComponent } from "./LoadingComponent";
import { ErrorComponent } from "./ErrorComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AxiosClient } from "./api/AxiosClient";

export default function App() {
    const getPokemons = () =>
        AxiosClient({
            url: `/pokemon`,
            method: "GET",
        });

    const { data, isLoading, isError } = useQuery({
        queryKey: "pokemon",
        queryFn: getPokemons,
    });

    const getInitials = (name: string) => {
        const names = name.split("-");
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        } else {
            return (
                names[0].charAt(0) + names[names.length - 1].charAt(0)
            ).toUpperCase();
        }
    };

    const getBackgroundColor = () => {
        const colors = [
            "bg-green-500",
            "bg-red-500",
            "bg-blue-500",
            "bg-yellow-500",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor;
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (isError) {
        return <ErrorComponent />;
    }

    if (data) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Table>
                    <TableHeader>
                        <TableHead>Pokemon</TableHead>
                    </TableHeader>
                    <TableBody>
                        {data.map((pokemon: any, index: number) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={pokemon.details.sprites.back_default}
                                                alt="@shadcn"
                                            />
                                            <AvatarFallback>
                                                <div
                                                    className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${getBackgroundColor()}`}
                                                >
                                                    <span className="text-white text-lg font-bold">
                                                        {getInitials(pokemon.name)}
                                                    </span>
                                                </div>
                                            </AvatarFallback>
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
