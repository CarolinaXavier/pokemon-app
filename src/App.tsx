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
import axios from "axios";
import { LoadingComponent } from "./LoadingComponent";

export default function App() {
    const { data, isLoading } = useQuery("pokemon", () => {
        return axios
            .get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
            .then((response) => {
                console.log(response);
                return response.data;
            });
    });

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Label>Pokemon App</Label>
            <Table>
                <TableHeader>
                    <TableHead>Pokemon</TableHead>
                </TableHeader>
                <TableBody>
                    {data.results.map((pokemon: any, index: number) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <pre>{JSON.stringify(pokemon, null, 2)}</pre>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
