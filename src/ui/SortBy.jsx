import { useSearchParams } from "react-router-dom"
import Select from "./Select"

function SortBy({ options }) {

    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sortBy') || options?.at(0)?.value || '';

    function handleChange(e) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('sortBy', e.target.value);
            return next;
        });
    };

    return (
        <Select options={options} type='white' onChange={handleChange} value={sortBy} />
    )
};

export default SortBy
