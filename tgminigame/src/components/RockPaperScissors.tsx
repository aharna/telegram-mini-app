import { useState } from "react";
import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "../client";
import { shortenAddress } from "thirdweb/utils";

type Choice = 'Rock' | 'Paper' | 'Scissors';
type Result = 'Win' | 'Lose' | 'Tie';

const choices: Choice[] = ['Rock', 'Paper', 'Scissors'];

const getComputerChoice = (): Choice => choices[Math.floor(Math.random() * choices.length)];

const determineWinner = (userChoice: Choice, computerChoice: Choice): Result => {
    if (userChoice === computerChoice) return 'Tie';
    if (
        (userChoice === 'Rock' && computerChoice === 'Scissors') ||
        (userChoice === 'Paper' && computerChoice === 'Rock') ||
        (userChoice === 'Scissors' && computerChoice === 'Paper')
    ) {
        return 'Win';
    } else {
        return 'Lose';
    }
};

interface GameResult {
    playerChoice: Choice;
    computerChoice: Choice;
    gameResult: Result;
}

export default function RockPaperScissors() {
    const [result, setResult] = useState<GameResult | null>(null);
    const account = useActiveAccount();
    const { disconnect } = useDisconnect();
    const wallet = useActiveWallet();
    const [showPrize, setShowPrize] = useState<boolean>(false);
    const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleChoice = (playerChoice: Choice) => {
        const computerChoice = getComputerChoice();
        const gameResult = determineWinner(playerChoice, computerChoice);
        setResult({ playerChoice, computerChoice, gameResult });
        setShowPrize(gameResult === 'Win');
    };

    const resetGame = () => {
        setResult(null);
        setShowPrize(false);
        setPrizeClaimed(false);
    };

    const claimPrize = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setPrizeClaimed(true);
    };
    
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#f0f0f0',
            color: '#333',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                padding: '2rem',
                margin: '0 0.5rem',
                width: '450px',
                maxWidth: '98%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <h1 style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    marginBottom: '1.5rem', 
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #007bff, #6f42c1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    padding: '0.5rem'
                }}>
                    Rock Paper Scissors
                </h1>
                
                {!account ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '300px',
                        width: '100%',
                        background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
                        borderRadius: '8px',
                        padding: '2rem'
                    }}>
                        <h3 style={{ 
                            fontSize: '1.2rem',
                            color: '#495057',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            Connect your wallet to play
                        </h3>
                        <div style={{ backgroundColor: '#007bff', padding: '3px', borderRadius: '8px' }}>
                            <ConnectButton
                                client={client}
                                wallets={[
                                    inAppWallet({
                                        auth: {
                                            options: ["email", "wallet"]
                                        }
                                    })
                                ]}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #e0e0e0',
                            padding: '0.5rem 0 1rem 0',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(0, 123, 255, 0.1)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: '#007bff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {account.address.substring(0, 1)}
                                </div>
                                <p style={{
                                    fontSize: '0.9rem',
                                    margin: 0,
                                    fontWeight: '500'
                                }}>
                                    {shortenAddress(account.address)}
                                </p>
                            </div>
                            <button
                                onClick={() => disconnect(wallet!)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(220, 53, 69, 0.9)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 5px rgba(220, 53, 69, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(220, 53, 69, 1)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(220, 53, 69, 0.3)';
                                }}
                            >
                                Disconnect
                            </button>
                        </div>
                            
                        {!result ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                padding: '1rem 0'
                            }}>
                                <h3 style={{ 
                                    fontSize: '1.3rem', 
                                    color: '#495057',
                                    marginBottom: '2rem',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    Choose your move:
                                </h3>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: '1.5rem', 
                                    margin: "1rem 0 2rem 0",
                                    width: '100%'
                                }}>
                                    {choices.map((choice) => (
                                        <button
                                            key={choice}
                                            onClick={() => handleChoice(choice)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(45deg, #007bff, #6f42c1)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontSize: '2.5rem',
                                                boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
                                                transition: 'all 0.2s ease',
                                                transform: 'scale(1)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 123, 255, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 123, 255, 0.3)';
                                            }}
                                        >
                                            {
                                                choice === 'Rock' ? '🪨' :
                                                choice === 'Paper' ? '📄' :
                                                '✂️'
                                            }
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                padding: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    width: '100%',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'linear-gradient(45deg, #007bff, #6f42c1)',
                                            borderRadius: '50%',
                                            fontSize: '2rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {
                                                result.playerChoice === 'Rock' ? '🪨' :
                                                result.playerChoice === 'Paper' ? '📄' :
                                                '✂️'
                                            }
                                        </div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>You</p>
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        color: 
                                            result.gameResult === 'Win' ? '#28a745' :
                                            result.gameResult === 'Lose' ? '#dc3545' :
                                            '#6c757d'
                                    }}>
                                        {
                                            result.gameResult === 'Win' ? 'WIN!' :
                                            result.gameResult === 'Lose' ? 'LOSE' :
                                            'TIE'
                                        }
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'linear-gradient(45deg, #6c757d, #495057)',
                                            borderRadius: '50%',
                                            fontSize: '2rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {
                                                result.computerChoice === 'Rock' ? '🪨' :
                                                result.computerChoice === 'Paper' ? '📄' :
                                                '✂️'
                                            }
                                        </div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Computer</p>
                                    </div>
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <button
                                        onClick={resetGame}
                                        style={{
                                            padding: '0.7rem 1.5rem',
                                            background: 'linear-gradient(45deg, #007bff, #0056b3)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '30px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 6px rgba(0, 123, 255, 0.25)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 6px 10px rgba(0, 123, 255, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 123, 255, 0.25)';
                                        }}
                                    >
                                        Play again
                                    </button>
                                    
                                    {showPrize && !prizeClaimed && (
                                        <button
                                            onClick={claimPrize}
                                            style={{
                                                padding: '0.7rem 1.5rem',
                                                background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                                                color: '#212529',
                                                border: 'none',
                                                borderRadius: '30px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                boxShadow: '0 4px 6px rgba(255, 193, 7, 0.3)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.boxShadow = '0 6px 10px rgba(255, 193, 7, 0.5)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(255, 193, 7, 0.3)';
                                            }}
                                        >
                                            Claim Prize 🏆
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            maxWidth: '400px',
                            width: '90%',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-40px',
                                left: 'calc(50% - 40px)',
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                boxShadow: '0 4px 10px rgba(255, 193, 7, 0.3)',
                            }}>
                                🏆
                            </div>
                            
                            <h3 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold', 
                                marginTop: '2rem',
                                marginBottom: '1rem',
                                textAlign: 'center',
                                color: '#212529'
                            }}>
                                Congratulations!
                            </h3>
                            
                            <p style={{ 
                                fontSize: '1.1rem', 
                                marginBottom: '1rem',
                                textAlign: 'center',
                                color: '#495057'
                            }}>
                                You won and can claim 10 tokens to your wallet
                            </p>
                            
                            
                                Claim 10 Tokens
                           
                            
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'transparent',
                                    color: 'red',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    marginTop: '0.5rem'
                                    
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}