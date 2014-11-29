// === decks_mydecks ===
Template.decks_mydecks.helpers({
    mydecks: function(){return Decks.find();}
});

// == decks_decklist_item ===
Template.decks_decklist_item.helpers({
    age: function(){return moment(this.created).fromNow()},
    isOwner: function(){return this.createdBy === Meteor.userId()}
});
Template.decks_decklist_item.events({
    'click button': function(){
        Meteor.call('deleteDeck', this._id);
    }
});

// == decks_deckscraper ===
Template.decks_deckscraper.events({
    'click #load': function(evt, template){
        evt.preventDefault();

        Session.set('decks_loadingCards', true);
        Session.set('decks_cards', null);

        var tappedOutUrl = template.find('#ld-tappedouturl').value;
        Session.set('decks_deckOriginUrl', tappedOutUrl);

        Meteor.call('scrapeFromTappedOut', tappedOutUrl, function(error, result){
            //todo: Do something with the error
            Session.set('decks_loadingCards', false);
            Session.set('decks_cards', result);
        });
    },
    'click #save': function(evt, template){
        evt.preventDefault();

        Meteor.call('createDeck', {
            name: template.find('#deck-name').value || 'New Deck',
            cards: Session.get('decks_cards'),
            origin: Session.get('decks_deckOriginUrl')
        });

        Session.set('decks_cards', null);
    }
});
Template.decks_deckscraper.helpers({
   loadingCards: function(){return Session.get('decks_loadingCards');},
   cards: function(){return Session.get('decks_cards');}
});