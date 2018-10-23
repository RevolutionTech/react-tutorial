import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(firstSquare) {
    let squares = [];
    for (let i = firstSquare; i < firstSquare + 3; ++i) {
      squares = squares.concat(this.renderSquare(i));
    }

    return <div className="board-row">{squares}</div>;
  }

  render() {
    let rows = [];
    for (let i = 0; i < 7; i += 3) {
      rows = rows.concat(this.renderRow(i));
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        selectedSquare: null,
        squares: Array(9).fill(null),
      }],
      sortHistoryAsc: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  sortHistory(sortAsc) {
    this.setState({sortHistoryAsc: sortAsc});
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        selectedSquare: i,
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  squareCoordinates(square) {
    if (square === null) {
      return;
    }

    const x = square % 3 + 1;
    const y = Math.floor(square / 3) + 1;
    return '(' + x + ', ' + y + ')';
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'moveSelected' : null}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {this.squareCoordinates(step.selectedSquare)}
        </li>
      )
    });
    const sortedMoves = this.state.sortHistoryAsc ? moves : moves.slice().reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            <div>
              <button onClick={() => this.sortHistory(!this.state.sortHistoryAsc)}>
                {'Sort ' + (this.state.sortHistoryAsc ? 'descending' : 'ascending')}
              </button>
            </div>
            {sortedMoves}
          </ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
