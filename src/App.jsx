import React, { useState, useEffect } from 'react';
    import './App.css';

    const depensesStandard = [
      "Alimentation",
      "Transport",
      "Logement",
      "Loisirs",
      "Santé",
      "Autres"
    ];

    function App() {
      const [transactions, setTransactions] = useState(() => {
        const storedTransactions = localStorage.getItem('transactions');
        return storedTransactions ? JSON.parse(storedTransactions) : [];
      });
      const [nouvelleTransaction, setNouvelleTransaction] = useState({
        type: 'depense',
        categorie: depensesStandard[0],
        montant: '',
      });

      useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
      }, [transactions]);

      const handleInputChange = (e) => {
        setNouvelleTransaction({ ...nouvelleTransaction, [e.target.name]: e.target.value });
      };

      const ajouterTransaction = () => {
        if (nouvelleTransaction.categorie && nouvelleTransaction.montant) {
          setTransactions([...transactions, { ...nouvelleTransaction, id: Date.now() }]);
          setNouvelleTransaction({ type: 'depense', categorie: depensesStandard[0], montant: '' });
        }
      };

      const supprimerTransaction = (id) => {
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
      };

      const calculerRevenus = () => {
        let revenus = 0;
        transactions.forEach((transaction) => {
          if (transaction.type === 'revenu') {
            revenus += parseFloat(transaction.montant);
          }
        });
        return revenus;
      };

      const calculerDepenses = () => {
        let depenses = 0;
        transactions.forEach((transaction) => {
          if (transaction.type === 'depense') {
            depenses += parseFloat(transaction.montant);
          }
        });
        return depenses;
      };

      const revenus = calculerRevenus();
      const depenses = calculerDepenses();
      const solde = revenus - depenses;

      return (
        <div className="app-container">
          <h1>Application de Budget Simple</h1>
          <div className="input-section">
            <select name="type" value={nouvelleTransaction.type} onChange={handleInputChange}>
              <option value="depense">Dépense</option>
              <option value="revenu">Revenu</option>
            </select>
            <select name="categorie" value={nouvelleTransaction.categorie} onChange={handleInputChange}>
              {depensesStandard.map(categorie => (
                <option key={categorie} value={categorie}>{categorie}</option>
              ))}
            </select>
            <input
              type="number"
              name="montant"
              placeholder="Montant"
              value={nouvelleTransaction.montant}
              onChange={handleInputChange}
            />
            <button onClick={ajouterTransaction}>Ajouter Transaction</button>
          </div>
          <div className="summary">
            <div className="revenus">
              Revenus: ${revenus.toFixed(2)}
            </div>
            <div className="depenses">
              Dépenses: ${depenses.toFixed(2)}
            </div>
            <div className="solde">
              Solde: ${solde.toFixed(2)}
            </div>
          </div>
          <div className="transactions">
            <h2>Transactions</h2>
            <div className="transaction-columns">
              <div className="column">
                <h3>Revenus</h3>
                {transactions
                  .filter(transaction => transaction.type === 'revenu')
                  .map(transaction => (
                    <div key={transaction.id} className="transaction">
                      <span>{transaction.categorie} - ${transaction.montant}</span>
                      <button onClick={() => supprimerTransaction(transaction.id)}>Supprimer</button>
                    </div>
                  ))}
              </div>
              <div className="column">
                <h3>Dépenses</h3>
                {transactions
                  .filter(transaction => transaction.type === 'depense')
                  .map(transaction => (
                    <div key={transaction.id} className="transaction">
                      <span>{transaction.categorie} - ${transaction.montant}</span>
                      <button onClick={() => supprimerTransaction(transaction.id)}>Supprimer</button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    export default App;
