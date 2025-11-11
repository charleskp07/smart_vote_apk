import './Input.css'

type InputProps = {
    reference: string;
    label: string;
    type: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string
}

export default function Input({
    reference,
    label,
    type,
    placeholder,
    value, onChange,
}: InputProps) {
    return (
        <div className="input-cover">
            <label
                htmlFor={reference}
                className="input-label">{label} :</label>

            <br />
            <input
                className="input"
                type={type}
                name={reference}
                id={reference}
                placeholder={placeholder}
                value={value} 
                onChange={onChange} />
        </div>
    )
}
