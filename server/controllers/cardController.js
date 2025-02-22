class CardController {
  createCard = async (req, res) => {
    const { name, description, typeId } = req.body;
    const projectId = req.params.projectId;
    const card = await addCardToDB(name, description, typeId, projectId);
    res.status(200).json({ message: "Card created successfully", card });
  }

  deleteCard = async (req, res) => {
    const cardId = req.params.cardId;
    const card = await deleteCardFromDB(cardId);
    res.status(200).json({ message: "Card deleted successfully", card });
  }

  updateCard = async (req, res) => {
    const cardId = req.params.cardId;
    const { name, description, typeId } = req.body;
    const card = await updateCardFromDB(cardId, name, description, typeId);
    res.status(200).json({ message: "Card updated successfully", card });
  }
}

module.exports = new CardController(); 