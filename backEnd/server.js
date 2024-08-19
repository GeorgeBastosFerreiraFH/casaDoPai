import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "mySecretKey@@01@@";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/admin/login", async (req, res) => {
  const { email, senha } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin && bcrypt.compareSync(senha, admin.senha)) {
    const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

app.post("/admin/register", async (req, res) => {
  const { email, senha } = req.body;
  const hashedPassword = bcrypt.hashSync(senha, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        senha: hashedPassword,
      },
    });
    res.status(201).json(admin);
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    res.status(400).json({ error: "Erro ao criar administrador" });
  }
});

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.adminId = decoded.id;
    next();
  });
};

app.post("/usuarios", authenticate, async (req, res) => {
  const {
    email,
    name,
    telefone,
    senha,
    dataNascimento,
    dataNascimentoFormatada,
    batismo,
    perguntaMinisterio,
    ministerios,
    perguntaCelula,
    celulas,
    cafeDeIntegracao,
    cursosConcluidos,
  } = req.body;

  try {
    const formattedDataNascimento = new Date(dataNascimento).toISOString();

    const user = await prisma.user.create({
      data: {
        email,
        name,
        telefone,
        senha,
        dataNascimento: formattedDataNascimento, // Usa a data formatada
        dataNascimentoFormatada, // Usa a data formatada para DD-MM-YYYY
        batismo: batismo || "não especificado",
        perguntaMinisterio: perguntaMinisterio || "não especificado",
        ministerios: ministerios || "não especificado",
        perguntaCelula: perguntaCelula || "não especificado",
        celulas: celulas || "não especificado",
        cafeDeIntegracao: cafeDeIntegracao || "não especificado",
        cursosConcluidos: cursosConcluidos.join(", "),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

app.get("/usuarios", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
});

app.put("/usuarios/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    email,
    name,
    telefone,
    senha,
    dataNascimento,
    dataNascimentoFormatada,
    batismo,
    perguntaMinisterio,
    ministerios,
    perguntaCelula,
    celulas,
    cafeDeIntegracao,
    cursosConcluidos,
  } = req.body;

  try {
    const formattedDataNascimento = new Date(dataNascimento).toISOString();

    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        telefone,
        senha,
        dataNascimento: formattedDataNascimento, // Usa a data formatada
        dataNascimentoFormatada, // Usa a data formatada para DD-MM-YYYY
        batismo: batismo || "não especificado",
        perguntaMinisterio: perguntaMinisterio || "não especificado",
        ministerios: ministerios || "não especificado",
        perguntaCelula: perguntaCelula || "não especificado",
        celulas: celulas || "não especificado",
        cafeDeIntegracao: cafeDeIntegracao || "não especificado",
        cursosConcluidos: cursosConcluidos.join(", "),
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(400).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete("/usuarios/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(400).json({ error: "Erro ao deletar usuário" });
  }
});

app.listen(3000);
