const path = require('path');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like, eachLike } = Matchers;
const {getFeedingInstructions} = require('../serviceCClient');

const provider = new Pact({
    consumer: 'Service B',
    provider: 'Service C',
    port: 2345,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
    spec: 2
});

describe('Contract with Service C', () => {
    beforeAll(() => {
        return provider.setup()
    });

    describe('when a request for all animals is made', () => {
        beforeAll(() => {
            const allAnimalsInteraction = {
                state: 'there are >= 3 animals',
                uponReceiving: 'a request for animals',
                withRequest: {
                    path: '/',
                    method: 'GET'
                },
                willRespondWith: {
                    body: eachLike({
                        name: like('Hufflepuff'),
                        image: {
                            path: like('/path/to/image')
                        },
                        foodSchedule: like({
                            morning: 'some insects',
                            lunch: 'worms!',
                            evening: 'snails'
                        })
                    }, { min: 3}),
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            };
            return provider.addInteraction(allAnimalsInteraction);
        });

        it('can process the JSON payload from the provider in the morning', () => {
            const serviceBAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['image', expect.any(String)],
                ['food', expect.any(String)]]);
            return expect(getFeedingInstructions('morning'))
                    .resolves
                    .toIncludeAllMembers([serviceBAnimalMatcher, serviceBAnimalMatcher, serviceBAnimalMatcher]);
        });

        it('can process the JSON payload from the provider at lunchtime', () => {
            const serviceBAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['image', expect.any(String)],
                ['food', expect.any(String)]]);
            return expect(getFeedingInstructions('lunch'))
                    .resolves
                    .toIncludeAllMembers([serviceBAnimalMatcher, serviceBAnimalMatcher, serviceBAnimalMatcher]);
        });

        it('can process the JSON payload from the provider in the evening', () => {
            const serviceBAnimalMatcher = expect.toContainAllEntries([
                ['name', expect.any(String)],
                ['image', expect.any(String)],
                ['food', expect.any(String)]]);
            return expect(getFeedingInstructions('evening'))
                    .resolves
                    .toIncludeAllMembers([serviceBAnimalMatcher, serviceBAnimalMatcher, serviceBAnimalMatcher]);
        });

        it('validates the interactions and creates a contract', () => {
            return provider.verify()
        });
    });

    afterAll(() => {
        provider.finalize();
    })

});
