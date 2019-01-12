'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function SetEventPrice ()
{
  var barInfo ;
  var price ;
  for(var i= 0; i < events.length; i++)
  {
       barInfo = FetchBarInfoById(events[i].barId);
       price = events[i].time * barInfo[0]+events[i].persons * barInfo[1];

       price=GroupReduction(price,events[i].persons);
       events[i].price = price;
  }
}

function GroupReduction (price, numberPeople)
{
  var result
  if(numberPeople >= 60){
    result = price/2;
  }
  else{
    if(numberPeople >= 20){
      result = price*0.70;
    }
    else{
      if(numberPeople >= 10){
        result = price*0.9;
      }else {
        result = price;
      }
    }
  }
  return result;
}

function FetchBarInfoById (id)
{
    for (var i = 0; i < bars.length; i++) {
      if(bars[i].id == id){
        var result = [bars[i].pricePerHour, bars[i].pricePerPerson];
      }
    }
    return result;
}

function SetCommission()
{
  var commissionTot;
    for (var i = 0; i < events.length; i++) {
      commissionTot = events[i].price*0.7;
      events[i].commission.insurance = commissionTot/2;
      events[i].commission.treasury = events[i].persons;
      events[i].commission.privateaser = commissionTot -events[i].commission.insurance-events[i].commission.treasury;
    }
}

function SetDeductibleOption() {
  for (var i = 0; i < events.length; i++) {
    if(events[i].options.deductibleReduction == true){
      var priceAugmentation = events[i].persons;
      events[i].price += priceAugmentation;
      events[i].commission.privateaser += priceAugmentation;
    }
  }
}

function SetPaymentActors(){
  for (var i = 0; i < actors.length; i++) {
    var event = FetchEventById(actors[i].eventId);
    for (var j = 0; j < actors[i].payment.length; j++) {
      switch (actors[i].payment[j].who) {
        case 'booker':
          actors[i].payment[j].amount = event.price;
          break;
        case 'bar':
          actors[i].payment[j].amount = event.price - (event.commission.insurance + event.commission.treasury + event.commission.privateaser);
          break;
        case 'insurance':
          actors[i].payment[j].amount = event.commission.insurance;
          break;
        case 'treasury':
          actors[i].payment[j].amount = event.commission.treasury;
          break;
        case 'privateaser':
          actors[i].payment[j].amount = event.commission.privateaser;
        default:
          break;
      }
    }
  }
}

function FetchEventById(id){
  for (var i = 0; i < events.length; i++) {
    if(id == events[i].id){
      var result = events[i];
    }
  }
  return result;
}

SetEventPrice();
SetCommission();
SetDeductibleOption();
SetPaymentActors();
console.log(bars);
console.log(events);
console.log(actors);
