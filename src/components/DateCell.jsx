import { Box, Icon, Center } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "./Icons/CalendarIcon";
import { forwardRef, useState } from "react";

// eslint-disable-next-line react/display-name
// eslint-disable-next-line react/display-name
const DateCustomInput = forwardRef(({ value, onClick, clearDate }, ref) => {
    return (
        <Box position="relative">
            <Center onClick={onClick} cursor="pointer" ref={ref}>
                {value ? (
                    <>
                        {value}
                        <Box
                            pos="absolute"
                            right={3}
                            fontSize="medium"
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearDate();
                            }}
                        >
                            &times;
                        </Box>
                    </>
                ) : (
                    <Icon as={CalendarIcon} fontSize="x-large" />
                )}
            </Center>
        </Box>
    );
});


function DateCell({ getValue, row, column, table }) {
    const [value, setValue] = useState(getValue());

    const updateValue = async (newValue) => {
        try {
            const response = await fetch(
                `https://658580bf022766bcb8c8c53a.mockapi.io/practic-api/todo/${row.original.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ [column.id]: newValue }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update date");
            }
            setValue(newValue);
            table.options.meta.updateData(row.index, column.id, newValue);
        } catch (error) {
            console.error("Error updating date:", error);
        }
    };

    return (
        <DatePicker
            wrapperClassName="date-wrapper"
            dateFormat="MMM d"
            selected={value}
            onChange={(date) => updateValue(date)}
            customInput={<DateCustomInput clearDate={() => updateValue(null)} />}
        />
    );
}

export default DateCell;
