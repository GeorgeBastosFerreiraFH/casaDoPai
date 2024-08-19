import { useForm } from "react-hook-form";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

const onSubmit = (data) => {
  console.log(data);
};

export default CadastroForm;
