describe('L.Control.Geocoder', function() {
  describe('namespace extension', function() {
    L.Control.Geocoder.foo = 'bar';
    expect(L.Control.Geocoder.foo).to.eql('bar');
  });
});
