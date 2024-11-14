import Array "mo:base/Array";
import Iter "mo:base/Iter";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

actor {

    stable var stableTaxPayers : [(Text, TaxPayer)] = [];

    type TaxPayer = {
        tid : Text;
        firstName : Text;
        lastName : Text;
        address : Text;
    };

    var taxPayers : HashMap.HashMap<Text, TaxPayer> = HashMap.HashMap<Text, TaxPayer>(10, Text.equal, Text.hash);

    public shared func addTaxPayer(tid : Text, firstName : Text, lastName : Text, address : Text) : async () {
        let newTaxPayer : TaxPayer = {
            tid = tid;
            firstName = firstName;
            lastName = lastName;
            address = address;
        };
        taxPayers.put(tid, newTaxPayer);
    };

    public query func getAllTaxPayers() : async [TaxPayer] {
        return Iter.toArray(taxPayers.vals());
    };

    public query func getTaxPayer(tid : Text) : async ?TaxPayer {
        return taxPayers.get(tid);
    };

    system func preupgrade() {
        stableTaxPayers := Iter.toArray(taxPayers.entries());
    };

    system func postupgrade() {
        taxPayers := HashMap.fromIter<Text, TaxPayer>(stableTaxPayers.vals(), 10, Text.equal, Text.hash);
    };
};
