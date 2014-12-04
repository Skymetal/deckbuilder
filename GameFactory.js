if(Meteor.isServer){
    Meteor.methods({
        /*deleteGame: function(gameId){
         Games.remove({_id: gameId});
         },
         updateGame: function(game){
         game.lastActivity = new Date();
         Games.update({_id: game._id}, game);
         },*/
        createGame: function(otherPlayerId){
            console.log("Creating game");
            Games.insert(utils.datastructures.creategame([Meteor.userId(), otherPlayerId]));
        },
        startGame: function(gameId){
            var game = Games.findOne({_id: gameId});
            if(game){
                game.players.forEach(function(player){
                    var deck = Decks.findOne({_id: player.deckId});
                    if(!deck){ return; }

                    var cards = [];
                    deck.mainboard.forEach(function(card){
                       for(var i = 0; i < card.quantity; i++){
                           cards.push({
                               _id: new Meteor.Collection.ObjectID()._str,
                               cardId: card.card_id
                           });
                       }
                    });

                    player.library = _.shuffle(cards);
                });
                game.inProgress = true;
                Games.update({_id: game._id}, game);
            }
        },
        drawCard: function(gameId){
            var res = utils.server.lookup(gameId);
            if(!res || !res.me || res.me.library.length <= 0) return;

            res.me.hand.push(res.me.library.pop());
            utils.server.update(res.game);
        },
        playerReady: function(gameId){
            var res = utils.server.lookup(gameId);
            if(!res.me || !res.me.deckId) return;

            res.me.ready = !res.me.ready;
            utils.server.update(res.game);
        },
        chooseDeck: function(ids){
            if(ids.length !== 2) return;
            var gameId = ids[0],
                deckId = ids[1];

            var res = utils.server.lookup(gameId);
            if(!res.me) return;

            res.me.deckId = deckId;
            utils.server.update(res.game);
        },
        addLife: function(gameId){
            var res = utils.server.lookup(gameId);
            if(!res.me) return;

            res.me.life++;
            utils.server.update(res.game);
        },
        subtractLife: function(gameId){
            var res = utils.server.lookup(gameId);
            if(!res.me) return;

            res.me.life--;
            utils.server.update(res.game);
        },
        playCard: function(ids){

            if(ids.length !== 2) return;
            var gameId = ids[0],
                card = ids[1];

            var res = utils.server.lookup(gameId);
            if(!res.me) return;

            var card = _.findWhere(res.me.hand, {_id: card._id});
            if(!card) return;

            var index = res.me.hand.indexOf(card);

            if(index > -1){
                res.me.hand.splice(index, 1);
                res.game.gameState.stack.push(utils.datastructures.createbattlefieldcard(card));
                utils.server.update(res.game);
            }
        }
    });
}