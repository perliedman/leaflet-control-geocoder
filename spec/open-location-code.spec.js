/* global OpenLocationCode */
describe('L.Control.Geocoder.OpenLocationCode', function() {
  var geocoder = new L.Control.Geocoder.OpenLocationCode({ OpenLocationCode: OpenLocationCode });

  it('geocodes 9C3XGW4F+5V', function() {
    var callback = sinon.fake();
    geocoder.geocode('9C3XGW4F+5V', callback);

    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg.length).to.eql(1);
    expect(callback.lastArg[0].name).to.eql('9C3XGW4F+5V');
    expect(callback.lastArg[0].center).to.eql({
      lat: 51.505437499999985,
      lng: -0.07531249999998124
    });
  });

  it('reverse geocodes 47.3/11.3', function() {
    var callback = sinon.fake();
    geocoder.reverse({ lat: 47.3, lng: 11.3 }, 131000, callback);

    expect(callback.calledOnce).to.be.ok();
    expect(callback.lastArg).to.be.ok();
    expect(callback.lastArg.length).to.eql(1);
    expect(callback.lastArg[0].name).to.eql('8FVH8822+22');
  });
});
