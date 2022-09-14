import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import { io } from 'socket.io-client';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { grey } from '@mui/material/colors';

import Spinner from '../components/shared/Spinner';

const Messages = ({ callback }) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setIsLoading] = useState(false);

  const [currentChat, setCurrentChat] = useState();

  const [currentMessages, setCurrentMessages] = useState([]);

  const [conversationList, setConversationList] = useState();

  const [newMessage, setNewMessage] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const socket = useRef();

  const scrollRef = useRef();

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const auth = useSelector((state) => state.auth);

  const userLoggedIn = auth && auth.isLoggedIn;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth && auth.token}`,
    },
  };

  const handleChatSelect = (conversation) => {
    setCurrentChat(conversation);
    getMessagesByChatId(conversation.chatId);
    setIsDrawerOpen(true);

    const newConversationList = conversationList.map((item) => {
      if (item.id === conversation.id) {
        return {
          ...item,
          new: false,
        };
      } else {
        return item;
      }
    });

    setConversationList(newConversationList);

    socket.current.emit('resetNewConversation', conversation.id);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleTextChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    if (newMessage.trim() !== '') {
      let isMessageSent = false;
      try {
        const newMessageToSend = {
          chatId: currentChat.chatId,
          sender: currentChat.sender._id,
          receiver: currentChat.receiver._id,
          text: newMessage,
        };

        socket.current.emit('sendMessage', newMessageToSend, (response) => {
          isMessageSent = response.status === 'ok' ? true : false;

          setCurrentMessages((prevState) => [
            ...prevState,
            { ...newMessageToSend, isMessageSent },
          ]);
        });

        setNewMessage('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getConversationsByUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/orders/getConversationsByUser/${auth && auth.id}`,
        config
      );
      const modifiedConversationLists = response.data.conversationLists.map(
        (conversation) => {
          let participants = {
            sender: '',
            receiver: '',
          };
          conversation.participants.forEach((user) => {
            if (user._id === auth.id) {
              participants.sender = user;
            } else {
              participants.receiver = user;
            }
          });

          return {
            id: conversation._id,
            chatId: conversation.chatId,
            lastActivity: conversation.lastActivity,
            lastText: conversation.lastText,
            new: conversation.new,
            sender: participants.sender,
            receiver: participants.receiver,
          };
        }
      );

      setConversationList(modifiedConversationLists);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getMessagesByChatId = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/getMessagesByChatId/${chatId}`,
        config
      );
      setCurrentMessages(response.data.messages.reverse());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/signin');
    }
  }, [navigate, userLoggedIn]);

  useEffect(() => {
    callback(true);
    return () => callback(false);
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // useEffect(() => {
  //   if (socket.current && auth) {
  //     socket.current.emit('addUser', auth.id);
  //   }
  // }, [socket, auth]);

  useEffect(() => {
    if (socket) {
      socket.current = io(process.env.REACT_APP_BACKEND_URL);

      if (auth) {
        socket.current.emit('addUser', auth.id);
      }

      socket.current.on('getMessage', (data) => {
        setArrivalMessage(data);
      });

      socket.current.on('updateConversationList', (conversationLists) => {
        const modifiedConversationLists = conversationLists.map(
          (conversation) => {
            let participants = {
              sender: '',
              receiver: '',
            };
            conversation.participants.forEach((user) => {
              if (user._id === auth?.id) {
                participants.sender = user;
              } else {
                participants.receiver = user;
              }
            });

            return {
              id: conversation._id,
              chatId: conversation.chatId,
              lastActivity: conversation.lastActivity,
              lastText: conversation.lastText,
              new: conversation.new,
              sender: participants.sender,
              receiver: participants.receiver,
            };
          }
        );
        setConversationList(modifiedConversationLists);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (arrivalMessage) {
      if (currentChat?.chatId === arrivalMessage.chatId) {
        setCurrentMessages((prevState) => [...prevState, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    getConversationsByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const conversation = (
    <>
      {currentChat ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              sx={{ bgcolor: 'inherit', color: 'inherit' }}
            >
              <Toolbar>
                {matchesSmDown && (
                  <IconButton sx={{ mr: 1 }} onClick={handleDrawerClose}>
                    <ArrowBackIcon />
                  </IconButton>
                )}

                <Avatar
                  src={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${currentChat.receiver.image}`}
                />
                <Typography noWrap sx={{ ml: 2, fontSize: '1.2rem' }}>
                  {currentChat.receiver.shopName}
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>

          <Box
            sx={{
              height: matchesSmDown ? '90vh' : '63vh',
              width: '100%',
              overflowY: 'auto',
              display: 'grid',
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ width: '100%' }}>
              {currentMessages &&
                currentMessages.map((message) => {
                  const isSelfMessage =
                    message.sender === auth.id ? true : false;
                  return (
                    <Box
                      sx={{
                        textAlign: isSelfMessage ? 'right' : 'left',
                      }}
                    >
                      <Typography
                        sx={{
                          bgcolor: isSelfMessage ? grey[200] : 'primary.main',
                          color: isSelfMessage ? 'black' : 'white',
                          mx: 3,
                          mt: 1,
                          py: 1,
                          px: 2,
                          display: 'inline-block',
                          borderRadius: 4,
                        }}
                      >
                        {message.text}
                      </Typography>

                      {message.createdAt && (
                        <Typography
                          sx={{ mb: 2, mx: 3.8, mt: 0.4, fontSize: '.7rem' }}
                        >
                          {format(new Date(message.createdAt), 'PPp')}
                        </Typography>
                      )}

                      {!message.createdAt && isSelfMessage && (
                        <Typography
                          sx={{ mb: 2, mx: 3.8, mt: 0.4, fontSize: '.7rem' }}
                        >
                          {message.isMessageSent ? 'Sent' : 'Not sent'}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              {currentChat && currentMessages && currentMessages.length < 1 && (
                <Box
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ mb: 5, ml: 5, textAlign: 'center' }}>
                    No messages to show. Start chatting
                  </Typography>
                </Box>
              )}
            </Box>
            <div ref={scrollRef}></div>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1.5,
              mb: { xs: 1.5, sm: 0 },
            }}
          >
            <TextField
              placeholder="Write new message"
              multiline
              name="newText"
              rows={2}
              fullWidth
              value={newMessage}
              onChange={handleTextChange}
              size="small"
              sx={{
                width: '100%',
                ml: 3.2,
                mr: 2.5,
                '& fieldset': {
                  borderRadius: 3.5,
                },
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mr: 4, px: 3 }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 15,
          }}
        >
          <Typography sx={{ fontSize: '1.2rem' }}>
            Select a conversation to start chatting
          </Typography>
        </Box>
      )}
    </>
  );

  const mobileDrawerView = (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      sx={{ top: 5 }}
    >
      {conversation}
    </Drawer>
  );

  return (
    <Paper
      sx={{
        height: 'calc(100vh - 115px)',
        // position: 'static',
      }}
    >
      <Spinner open={isLoading} />
      <Box sx={{ display: 'flex', direction: 'row' }}>
        <Box
          sx={{
            width: { xs: '100%', sm: '33%' },
            height: 'calc(100vh - 115px)',
            overflowY: 'auto',
            borderRight: { xs: 0, sm: `3.2px solid ${grey[200]}` },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ ml: 2, my: 1 }}>
              Conversations
            </Typography>
          </Box>
          <Divider />
          <List>
            {conversationList &&
              conversationList.map((item) => (
                <ListItem
                  sx={{
                    bgcolor:
                      item.chatId === (currentChat ? currentChat.chatId : null)
                        ? grey[300]
                        : 'inherit',
                    py: 0.5,
                  }}
                >
                  <ListItemButton onClick={() => handleChatSelect(item)}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{ width: 42, height: 42 }}
                        src={`${process.env.REACT_APP_CLOUD_IMAGE_URL}/${
                          item.receiver && item.receiver.image
                        }`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '1rem',
                            fontWeight: item.new ? 'bold' : 'normal',
                          }}
                        >
                          {item.receiver && item.receiver.shopName}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '.8rem',
                            color: 'text.secondary',
                            fontWeight: item.new ? 'bold' : 'normal',
                          }}
                        >
                          {item.lastText}
                        </Typography>
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>

        {matchesSmDown ? (
          <>{mobileDrawerView}</>
        ) : (
          <Box
            sx={{
              width: '67%',
            }}
          >
            {conversation}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Messages;
