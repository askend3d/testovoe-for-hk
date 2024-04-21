import { Box, Spinner, Button, Center } from "@chakra-ui/react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EditableCell from "./EditableCell";
import DateCell from "./DateCell";


const TaskTable = () => {
    const [todos, setTodos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTodos();
    }, []);

    async function getTodos() {
        const response = await fetch(
            "https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo"
        );
        const data = await response.json();
        setTodos(data);
        setLoading(false);
    }

    const addNote = async () => {
        const response = await fetch(
            "https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        getTodos();
    };

    const deleteNote = async (id) => {
        await fetch(
            `https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo/${id}`,
            {
                method: "DELETE",
            }
        );
        getTodos();
    };

    const columns = [
        {
            accessorKey: "task",
            header: "Task",
            size: 225,
            cell: EditableCell,
        },
        {
            accessorKey: "date",
            header: "Time",
            cell: DateCell,
        },
        {
            accessorKey: "notes",
            header: "note",
            cell: EditableCell,
        },
        {
            accessorKey: "emoji",
            header: "Emoji",
            cell: (props) => <p>{props.getValue()}</p>,
        },
        {
            header: "Actions",
            cell: (props) => (
                <Button
                    className="button-delete"
                    onClick={() => deleteNote(props.row.original.id)}
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    fontWeight="normal"
                    _hover={{ bg: "red.500", color: "white" }}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: todos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        meta: {
            updateData: (rowIndex, columnId, value) =>
                setTodos((prev) =>
                    prev.map((row, index) =>
                        index === rowIndex
                            ? { ...prev[rowIndex], [columnId]: value }
                            : row
                    )
                ),
        },
    });

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box>
            <Button onClick={addNote} mb="4">
                Add Note
            </Button>
            <Box className="table" w={table.getTotalSize()}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Box className="tr" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Box
                                w={header.getSize()}
                                className="th"
                                key={header.id}
                            >
                                {header.column.columnDef.header}
                                <Box
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={`resizer ${
                                        header.column.getIsResizing() &&
                                        "isResizing"
                                    }`}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}

                {table.getRowModel() &&
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
