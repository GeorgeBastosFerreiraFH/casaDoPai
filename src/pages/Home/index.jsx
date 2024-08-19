import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import "./style.css";
// import Lixeira from "../../assets/16qg.svg";
import api from "../../services/api.js";

function Home() {
  const [users, setUsers] = useState([]);

  const [showExtraInput, setShowExtraInput] = useState(false);
  const [showExtraInput3, setShowExtraInput3] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [selectedOption4, setSelectedOption4] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = useRef({});
  password.current = watch("senha", "");

  const checkboxCelula = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setShowExtraInput(value === "sim");
  };

  const handleCheckboxChange2 = (e) => {
    const value = e.target.value;
    setSelectedOption2(value);
  };

  const handleCheckboxChange3 = (e) => {
    const value = e.target.value;
    setSelectedOption3(value);
    setShowExtraInput3(value === "sim");
  };

  const handleCheckboxChange4 = (e) => {
    const value = e.target.value;
    setSelectedOption4(value);
  };

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");
    setUsers(usersFromApi.data);
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const dia = String(d.getDate() + 1).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0"); // +1 porque os meses começam em 0
    const ano = d.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  async function createUsers(data) {
    try {
      const formattedDataNascimento = new Date(
        data.dataNascimento
      ).toISOString(); // Converte para string ISO 8601
      const formattedDataNascimentoDDMMYYYY = formatDate(data.dataNascimento); // Converte para DD-MM-YYYY

      const cursosConcluidos = [];
      if (data.meuNovoCaminho) cursosConcluidos.push("Meu Novo Caminho");
      if (data.vidaDevocional) cursosConcluidos.push("Vida Devocional");
      if (data.familiaCrista) cursosConcluidos.push("Família Cristã");
      if (data.vidaDeProsperidade)
        cursosConcluidos.push("Vida de Prosperidade");
      if (data.principiosDeAutoridade)
        cursosConcluidos.push("Princípios de Autoridade");
      if (data.vidaDeEspirito) cursosConcluidos.push("Vida no Espírito");
      if (data.caraterDeCristo) cursosConcluidos.push("Caráter de Cristo");
      if (data.identidadesRestauradas)
        cursosConcluidos.push("Identidades Restauradas");

      await api.post("/usuarios", {
        name: data.nome,
        email: data.email,
        senha: data.senha,
        dataNascimento: formattedDataNascimento, // Usa a data formatada para ISO 8601
        telefone: data.telefone,
        dataNascimentoFormatada: formattedDataNascimentoDDMMYYYY, // Adiciona a data formatada para DD-MM-YYYY
        batismo: selectedOption2,
        perguntaMinisterio: selectedOption3,
        ministerios: data.ministerios,
        perguntaCelula: selectedOption,
        celulas: data.celulas,
        cafeDeIntegracao: selectedOption4,
        cursosConcluidos,
      });
      getUsers();
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setErrorMessage("Erro ao enviar os dados. Tente novamente.");
    }
  }

  // async function deleteUsers(id) {
  //   await api.delete(`/usuarios/${id}`);
  //   getUsers();
  // }

  useEffect(() => {
    getUsers();
  }, []);

  const onSubmit = (data) => {
    if (data.senha.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres.");
    } else if (data.senha !== data.confirmarSenha) {
      setErrorMessage("As senhas não coincidem.");
    } else {
      setErrorMessage("");
      createUsers(data);
    }
  };

  return (
    <div className="container">
      <section>
        <h1>Cadastro de usuário</h1>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-inputs">
          <label>Nome Completo</label>
          <input
            {...register("nome", {
              minLength: 3,
              maxLength: 40,
              required: true,
              pattern: /[A-Za-z]/,
            })}
            placeholder="Digite o seu nome completo"
          />
          {errors.nome && <span>Digite o nome corretamente.</span>}

          <label>Data de Nascimento</label>
          <input
            type="date"
            {...register("dataNascimento", {
              valueAsDate: true,
              required: "Digite a data de nascimento corretamente.",
            })}
          />
          {errors.dataNascimento && (
            <span>{errors.dataNascimento.message}</span>
          )}

          <label>Email</label>
          <input
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            })}
            placeholder="Digite o seu email"
          />
          {errors.email && <span>Digite o email corretamente.</span>}

          <label>Telefone</label>
          <InputMask
            mask="(99) 99999-9999"
            {...register("telefone", {
              required: true,
              pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            })}
            placeholder="Digite o seu telefone"
          />
          {errors.telefone && <span>Digite o telefone corretamente.</span>}

          <label>Concluio o Batismo:</label>
          <div className="checkbox">
            <div>
              <label>
                Sim
                <input
                  type="checkbox"
                  value="sim"
                  checked={selectedOption2 === "sim"}
                  {...register("batismo", { required: true })}
                  onChange={handleCheckboxChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Não
                <input
                  type="checkbox"
                  value="nao"
                  checked={selectedOption2 === "nao"}
                  {...register("batismo", { required: true })}
                  onChange={handleCheckboxChange2}
                />
              </label>
            </div>
            {errors.batismo && <span>Este campo é obrigatório</span>}
          </div>

          <label>Participa de algum ministério:</label>
          <div className="checkbox">
            <div>
              <label>
                Sim
                <input
                  type="checkbox"
                  value="sim"
                  checked={selectedOption3 === "sim"}
                  {...register("perguntaMinisterio", { required: true })}
                  onChange={handleCheckboxChange3}
                />
              </label>
            </div>
            <div>
              <label>
                Não
                <input
                  type="checkbox"
                  value="nao"
                  checked={selectedOption3 === "nao"}
                  {...register("perguntaMinisterio", { required: true })}
                  onChange={handleCheckboxChange3}
                />
              </label>
            </div>
            {errors.perguntaMinisterio && <span>Este campo é obrigatório</span>}
          </div>

          {showExtraInput3 && (
            <div>
              <label>Qual ministério:</label>
              <div>
                <select {...register("ministerios", { required: true })}>
                  <option value="">Ministérios</option>
                  <option value="acolhimento">Acolhimento</option>
                  <option value="midias">Mídias</option>
                  <option value="louvor">Louvor</option>
                  <option value="danca">Dança</option>
                  <option value="infantil">Infantil</option>
                  <option value="teens">Teens</option>
                </select>
              </div>
              {errors.ministerios && <span>Este campo é obrigatório</span>}
            </div>
          )}

          <label>Faz parte de alguma célula:</label>
          <div className="checkbox">
            <div>
              <label>
                Sim
                <input
                  type="checkbox"
                  value="sim"
                  checked={selectedOption === "sim"}
                  {...register("perguntaCelula", { required: true })}
                  onChange={checkboxCelula}
                />
              </label>
            </div>
            <div>
              <label>
                Não
                <input
                  type="checkbox"
                  value="nao"
                  checked={selectedOption === "nao"}
                  {...register("perguntaCelula", { required: true })}
                  onChange={checkboxCelula}
                />
              </label>
            </div>
            {errors.perguntaCelula && <span>Este campo é obrigatório</span>}
          </div>

          {showExtraInput && (
            <div>
              <label>Qual célula participa:</label>
              <div>
                <select {...register("celulas", { required: true })}>
                  <option value="">Células</option>
                  <option value="reobote">Reobote</option>
                  <option value="salDaTerra">Sal da terra</option>
                  <option value="zoeLideres">Zóe Líderes</option>
                  <option value="kadosh">Kadosh</option>
                  <option value="elSahmmah">El-sahmmah</option>
                  <option value="exousia">Exousia</option>
                  <option value="dunamis">Dunamis</option>
                  <option value="freedom">Freedom</option>
                  <option value="atos2">Atos 2</option>
                </select>
              </div>
              {errors.celulas && <span>Este campo é obrigatório</span>}
            </div>
          )}

          <label>Participou do Café de Integração:</label>
          <div className="checkbox">
            <div>
              <label>
                Sim
                <input
                  type="checkbox"
                  value="sim"
                  checked={selectedOption4 === "sim"}
                  {...register("cafeDeIntegracao", { required: true })}
                  onChange={handleCheckboxChange4}
                />
              </label>
            </div>
            <div>
              <label>
                Não
                <input
                  type="checkbox"
                  value="nao"
                  checked={selectedOption4 === "nao"}
                  {...register("cafeDeIntegracao", { required: true })}
                  onChange={handleCheckboxChange4}
                />
              </label>
            </div>
            {errors.cafeDeIntegracao && <span>Este campo é obrigatório</span>}
          </div>

          <label>Cursos concluídos:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                paddingRight: "50px",
              }}
            >
              <a style={{ fontWeight: "bold" }}>Fundamento Cristão</a>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("meuNovoCaminho")} />
                  Meu Novo Caminho
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("vidaDevocional")} />
                  Vida Devocional
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("familiaCrista")} />
                  Família Cristã
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("vidaDeProsperidade")} />
                  Vida de Prosperidade
                </label>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <a style={{ fontWeight: "bold" }}>Maturidade Cristã</a>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="checkbox"
                    {...register("principiosDeAutoridade")}
                  />{" "}
                  Princípios de Autoridade
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("vidaDeEspirito")} />
                  Vida no Espirito
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input type="checkbox" {...register("caraterDeCristo")} />
                  Caráter de Cristo
                </label>
              </div>
              <div>
                <label style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="checkbox"
                    {...register("identidadesRestauradas")}
                  />{" "}
                  Identidades Restauradas
                </label>
              </div>
            </div>
          </div>

          <label>Senha</label>
          <input
            type="password"
            {...register("senha", {
              required: true,
              minLength: 6,
            })}
            placeholder="Digite a sua senha"
          />
          {errors.senha && (
            <span>A senha deve ter no mínimo 6 caracteres.</span>
          )}

          <label>Confirme a Senha</label>
          <input
            type="password"
            {...register("confirmarSenha", {
              required: true,
              validate: (value) =>
                value === password.current || "As senhas não coincidem.",
            })}
            placeholder="Confirme a sua senha"
          />
          {errors.confirmarSenha && (
            <span>{errors.confirmarSenha.message}</span>
          )}

          <button type="submit">Cadastrar</button>
        </div>
      </form>

      {/* {user.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span> {user.name}</span>
            </p>
            <p>
              Email: <span> {user.email} </span>
            </p>
            <p>
              Senha: <span> {user.senha} </span>
            </p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Lixeira} />
          </button>
        </div>
      ))} */}
    </div>
  );
}

export default Home;
