const {
  getCardFromDB,
  addCardToDB,
  deleteCardFromDB,
  updateCardFromDB,
} = require("../db/cardDB");

class CardController {
  getCard = async (req, res) => {
    const cardId = req.params.cardId;
    try {
      const card = await getCardFromDB(cardId);
    res.status(200).json({ message: "Card fetched successfully", card });
    }catch (error) {
      res.status(500).json({ message: "Error fetching card", error: error.message });
    }
    

  };

  createCard = async (req, res) => {
    const { title, description, typeId } = req.body;
    const projectId = req.params.projectId;
    try{
      const card = await addCardToDB(title, description, typeId, projectId);
    res.status(200).json({ message: "Card created successfully", card });
    }catch (error) {
      res.status(500).json({ message: "Error creating card", error: error.message });
    }
  };

  deleteCard = async (req, res) => {
    const cardId = req.params.cardId;
    try {
      const card = await deleteCardFromDB(cardId);
    res.status(200).json({ message: "Card deleted successfully", card });
    }catch (error) {
      res.status(500).json({ message: "Error deleting card", error: error.message });
    }
  };

  updateCard = async (req, res) => {
    const cardId = req.params.cardId;
    const { title, description, typeId } = req.body;
    try{
      const card = await updateCardFromDB(cardId, title, description, typeId);
    res.status(200).json({ message: "Card updated successfully", card });
    }catch (error) {
      res.status(500).json({ message: "Error updating card", error: error.message });
    }
  };
}

module.exports = new CardController();
