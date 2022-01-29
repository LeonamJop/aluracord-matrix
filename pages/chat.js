import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNjE5NCwiZXhwIjoxOTU4OTAyMTk0fQ.saKVI__qgXKn2gb1JEOyuJz8CbdkpggSzFieBHT4fLE";

const SUPABASE_URL = "https://adqhctfxbajjlrsvykgp.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem){
  return supabaseClient
    .from("mensagens")
    .on('INSERT', (respostaLive) => {
      // console.log('Houve uma nova mensagem', oQueVeio);
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const useuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagem] = React.useState([]);

  /* 
        //Usuário
        -Usuário digita no campo textarea
        -Aperta enter para enviar
        -Tem que adicionar o texto na listagem
        
        //Dev
        -[X] Campo criado
        -[X] Vamos usar o onChange, usar o useState (ter if pra caso seje enter limpar a variavel)
        -[X] Lista de mensagens
    */

  // Sua lógica vai aqui

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order('id', {ascending: false})
      .then(({ data }) => {
        // console.log("Dados da consulta:", data);
        setListaDeMensagem(data);
      });
      escutaMensagemEmTempoReal((novaMensagem) => {
        console.log('novaMensagem:', novaMensagem);
        setListaDeMensagem((valorAtualDaLista) => {
          return [
            novaMensagem,
            ...valorAtualDaLista
          ]
        });
      });
  }, []);

  function handleNewMesage(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: useuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {
        // console.log('Criando mensagem:', data);
      });

    setMensagem('');
  }
  // ./Sua lógica vai aqui

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => {
                const valor = e.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNewMesage(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            {/* CallBack */}
            <ButtonSendSticker
              onStickerClick = {(sticker) => {
                // console.log('[USEANDO O COMPONENTE]Salva esse sticker', sticker);
                handleNewMesage(`:sticker: ${sticker}`)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {/* Condicional: {mensagem.texto.startsWith(':stiker:').toString()} */}
            {/* Declarativo */}
            {mensagem.texto.startsWith(':sticker:') 
              ? (
                <Image src={mensagem.texto.replace(':sticker:', '')} />
              )
              : (
                mensagem.texto
              )}
            {/* {mensagem.texto} */}
          </Text>
        );
      })}
    </Box>
  );
}
