Template.play.helpers({
   game: function(){
       console.log(this);
       return this;
   },
    me: function(){
        return this.playerId === Meteor.userId();
    }
});

Template.play.events({
   'click button': function(evt, template){
       //console.log("Draw Card");
       Meteor.call('drawCard', Session.get("currentGame")._id, function(error, result){
           //console.log(Session.get("currentGame"));
       });
   }
});

Template.play_hand.helpers({
    cardsInHand: function(){
        var player = _.find(this.players, function(player){ return player.playerId === Meteor.userId()});
        return player.hand.map(function(cardId){
            return {
                card: Cards.findOne({_id: cardId}),
                tapped: false
            };
        });
    }
});

Template.play_card.helpers({
});

Template.play_layout.helpers({
    state: function () {
        var turnstate = Session.get('turnstate');
        if(!turnstate) Session.set('turnstate', {
            untap: true,
            upkeep: false,
            draw: false,
            main1: false,
            combat: false,
            attackers: false,
            blockers: false,
            damage: false,
            main2: false,
            end: false
        });

        return turnstate;
    },
    players: function () {
        return Session.get('currentGame').players;
    },
    activePlayer: function () {
        if (this.players) return _.findWhere(this.players, {playerId: Meteor.userId()});
    }
});

Template.play_layout.events({
    'click .btn-turnstate-action': function(evt, template){

        var turnstate = Session.get('turnstate');

        if(turnstate){

            if(turnstate.untap) {
                turnstate.untap = false;
                turnstate.upkeep = true;
            }else if(turnstate.upkeep){
                turnstate.upkeep = false;
                turnstate.draw = true;
            }else if(turnstate.draw){
                turnstate.draw = false;
                turnstate.main1 = true;
            }else if(turnstate.main1){
                turnstate.main1 = false;
                turnstate.combat = true;
            }else if(turnstate.combat){
                turnstate.combat = false;
                turnstate.attackers = true;
            }else if(turnstate.attackers){
                turnstate.attackers = false;
                turnstate.blockers = true;
            }else if(turnstate.blockers){
                turnstate.blockers = false;
                turnstate.damage = true;
            }else if(turnstate.damage){
                turnstate.damage = false;
                turnstate.main2 = true;
            }else if(turnstate.main2){
                turnstate.main2 = false;
                turnstate.end = true;
            }else if(turnstate.end){
                turnstate.end = false;
                turnstate.untap = true;
            }

            Session.set('turnstate', turnstate);
        }
    }
});

Template.play_player_status.helpers({
    username: function(){ return Meteor.users.findOne({_id: this.playerId}).username; }
});