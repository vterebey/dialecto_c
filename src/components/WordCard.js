import React, { useState } from "react";
import {
    Card as MuiCard,
    CardContent,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Collapse,
    IconButton
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Иконка для кнопки воспроизведения
import { green, blue, purple } from '@mui/material/colors';
import {markAsLearned} from "../services/cardService";

const WordCard = ({ id, word, definitions, audio_pronciations, onNextCard, onMarkAsLearned, currentIndex, isLearning }) => {
  const [open, setOpen] = useState(false);
  const [wordId, setWordId] = useState(id);

  const handleToggle = () => {
    setOpen(!open);  // Переключаем состояние для раскрытия/сокрытия
  };

  const handleAudioPlay = (audioSrc) => {
    if (!audioSrc) {
      console.error("Audio source is missing.");
      return;
    }
    try {
      const audio = new Audio(`http://localhost/${audioSrc}`);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } catch (error) {
      console.error("Error creating audio object:", error);
    }
  };

  // Версия для изучения
  const handleMarkAsLearnedAndNext = () => {
    onMarkAsLearned(currentIndex, wordId); // Отметить слово как выученное
    //onNextCard(); // Переход к следующей карточке
  };

  // Версия для профиля
  const handleDeleteFromLearnedAndNext = () => {
    onMarkAsLearned(currentIndex, wordId, true); // Удалить слово из выученных
    //onNextCard(); // Переход к следующей карточке
  };

  return (
    <MuiCard
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#f3f4f6",
        transition: "all 0.3s ease-in-out",
        ':hover': { boxShadow: 6 },
        padding: 2
      }}
    >
      <CardContent>
        {/* Заголовок карточки */}
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", fontSize: 22, color: blue[700], marginBottom: 1 }}
        >
          {word || "No word provided"}
        </Typography>

        {/* Произношения */}
        {audio_pronciations?.length > 0 && (
          <div>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 1, fontStyle: 'italic' }}
            >
              Pronunciations:
            </Typography>
            {audio_pronciations.slice(0, 1).map((pronunciation, index) => (
              <div key={index} style={{ marginTop: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  {pronunciation.description || "No description"}:
                  [{pronunciation.transcription || "No transcription"}]
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    marginTop: 1,
                    backgroundColor: purple[500],
                    color: "white",
                    "&:hover": { backgroundColor: purple[700] },
                    borderRadius: "50%",
                    padding: 1
                  }}
                  onClick={() => handleAudioPlay(pronunciation.audio)}
                >
                  <PlayArrowIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        )}

        {/* Определения */}
        {definitions?.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              Definitions:
            </Typography>
            <Collapse in={open}>
              {definitions.map((def, index) => (
                <div key={index} style={{ marginBottom: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", fontSize: 14 }}
                  >
                    {def.definition || "No definition"} ({def.level || "No level"})
                  </Typography>
                  {def.translations?.length > 0 && (
                    <List sx={{ paddingLeft: 1 }}>
                      {def.translations.slice(0, 1).map((translation, transIndex) => (
                        <ListItem
                          key={transIndex}
                          sx={{ backgroundColor: blue[50], borderRadius: 2, margin: "5px 0" }}
                        >
                          <ListItemText
                            primary={translation.translation || "No translation"}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {def.examples?.length > 0 && (
                    <Box sx={{ paddingLeft: 2, marginTop: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', marginBottom: 1 }}
                      >
                        Examples:
                      </Typography>
                      <List>
                        {def.examples.map((example, exampleIndex) => (
                          <ListItem key={exampleIndex} sx={{ marginBottom: 1 }}>
                            <ListItemText
                              primary={example.example || "No example"}
                              secondary={example.translation
                                  ? `Translation: ${example.translation}`
                                  : null}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </div>
              ))}
            </Collapse>
            <Button
              size="small"
              onClick={handleToggle}
              sx={{
                marginTop: 1,
                color: blue[600],
                "&:hover": { backgroundColor: blue[100], fontWeight: 'bold' },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {open ? "Show Less" : "Show More"}
            </Button>
          </Box>
        )}

        {/* Кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          {isLearning === true ? (
            <>
              <Button
                size="small"
                sx={{
                  backgroundColor: green[600],
                  color: "white",
                  "&:hover": { backgroundColor: green[800] },
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                }}
                variant="contained"
                onClick={() => handleMarkAsLearnedAndNext()} // Удаление и переход к следующей карточке
              >
                I already know this word
              </Button>

              <Button
                size="small"
                sx={{
                  backgroundColor: blue[600],
                  color: "white",
                  "&:hover": { backgroundColor: blue[800] },
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                }}
                variant="contained"
                onClick={() => onNextCard() } // Переход к следующей карточке
              >
                Start learning this word
              </Button>
            </>
          ) : (
            <>
              <Button
                size="small"
                sx={{
                  backgroundColor: blue[600],
                  color: "white",
                  "&:hover": { backgroundColor: blue[800] },
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                }}
                variant="contained"
                onClick={handleDeleteFromLearnedAndNext} // Удалить из выученных и переходить к следующему
              >
                Remove from learned
              </Button>

              <Button
                size="small"
                sx={{
                  backgroundColor: green[600],
                  color: "white",
                  "&:hover": { backgroundColor: green[800] },
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                }}
                variant="contained"
                onClick={() => onNextCard()} // Переход к следующей карточке
              >
                Next word
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </MuiCard>
  );
};

export default WordCard;
