const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

jest.mock('../../models/User', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
}));

describe('GET /user', () => {
    beforeEach(() => {
        User.find.mockResolvedValue([
            { _id: '1', name: 'Queila', lastname: 'Lima', salary: 1234 },
            { _id: '2', name: 'Alisson', lastname: 'Ferro', salary: 1234 },
            { _id: '3', name: 'Dom', lastname: 'Ramalho', salary: 1234 },
        ]);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar um array com 3 elementos', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
    });
});

describe('GET by ID', () => {
    beforeEach(() => {
        User.findById.mockResolvedValue(
            { _id: '2', name: 'Alisson', lastname: 'Ferro', salary: 1234 }
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Deve retornar status 400', async () => {
        const res = await request(app).get('/api/user/2');
        expect(res.status).toBe(200);
    });
});

describe('POST', ()=> {
    beforeEach(() => {
        User.create.mockResolvedValue([
            { _id: '1', name: 'Queila', lastname: 'Lima', salary: 1234 },
        ]);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Deve enviar os dados e salvar no banco', async () => {
        const userData = { name: 'Queila', lastname: 'Lima', salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', userData.name);
        expect(res.body).toHaveProperty('lastname', userData.lastname);
        expect(res.body).toHaveProperty('salary', userData.salary);
        expect(User.create).toHaveBeenCalledWith(userData);
    });
});