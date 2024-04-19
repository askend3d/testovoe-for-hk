import { Box, Spinner } from "@chakra-ui/react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const TaskTable = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getTodos() {
        const response = await fetch(
            "https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo"
        );
        const data = await response.json();
        console.log(data)
        setTodos(data);
        setLoading(false);
    }

    useEffect(() => {
        getTodos();
    }, []);

    const columns = [
        {
            accessorKey: "task",
            header: "Task",
            cell: (props) => <p>{props.getValue()}</p>,
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: (props) => <p>{props.getValue()?.toLocaleTimeString()}</p>,
        },
        {
            accessorKey: "notes",
            header: "note",
            cell: (props) => <p>{props.getValue()}</p>,
        },
        {
            accessorKey: "emoji",
            header: "Emoji",
            cell: (props) => <p>{props.getValue()}</p>,
        },
    ];

    const table = useReactTable({
        todos,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return <Spinner size="xl" />;
    }
    return (
        <Box>
            <Box className="table">
                {table.getHeaderGroups().map((headerGroup) => (
                    <Box className="tr" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Box className="th" key={header.id}>
                                {header.column.columnDef.header}
                            </Box>
                        ))}
                    </Box>
                ))}
                {table.getRowModel().rows &&
                    table.getRowModel().rows.map((row) => (
                        <Box className="tr" key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Box
                                    className="td"
                                    w={cell.column.getSize()}
                                    key={cell.id}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ))}
            </Box>
        </Box>
    );
};
export default TaskTable;
