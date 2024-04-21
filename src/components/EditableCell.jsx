import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function EditableCell({ getValue, row, column, table }) {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const onBlur = async () => {
        await fetch(
            `https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo/${row.original.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [column.id]: value }),
            }
        );
        table.options.meta.updateData(row.index, column.id, value);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Input
            variant="filled"
            value={value}
            size="sm"
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            w="85%"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            style={{ background: "transparent" }}
        />
    );
}

export default EditableCell;
