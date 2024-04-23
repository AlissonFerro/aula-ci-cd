const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

jest.mock('../../models/User', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
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
    afterAll(() => {
        app.close();
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
            { _id: '1', name: 'Alisson', lastname: 'Ferro', salary: 1234 }
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        app.close();
    });
    it('Deve retornar status 200', async () => {
        const res = await request(app).get('/api/user/1');
        expect(res.status).toBe(200);
        expect(User.findById).toHaveBeenCalledWith('1')
    });
    it('Deve retornar status 404 se não encontrar o usuário', async() => {
        const res = await request(app).get('/api/user/12');
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/User not found/);
    })
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
    afterAll(() => {
        app.close();
    });
    it('Deve retornar bad request quando não enviar o nome', async() => {
        const userData = { lastname: "Ferro", salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Name is require/);
    });
    
    it('Deve retornar bad request quando não enviar sobrenome', async() => {
        const userData = { name: "Alisson", salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Lastname is require/);
    });
    
    it('Deve retornar bad request quando o nome for menor que 3 caracteres', async() => {
        const userData = { name: "Al", lastname: "Ferro", salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/is shorter than 3 characteres/);
    });

    it('Deve retornar bad request quando o lastname for menor que 3 caracteres', async() => {
        const userData = { name: 'Alisson', lastname: 'Fe', salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Lastname is shorter than 3 characteres/);
    });
    
    it('Deve enviar os dados e salvar no banco com status 201', async () => {
        const userData = { name: 'Queila', lastname: 'Lima', salary: 1234 };
        const res = await request(app).post('/api/user').send(userData);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', userData.name);
        expect(res.body).toHaveProperty('lastname', userData.lastname);
        expect(res.body).toHaveProperty('salary', userData.salary);
        expect(User.create).toHaveBeenCalledWith(userData);
    });
});

describe('PUT by ID', () => {
    beforeEach(() => {
        User.findById.mockResolvedValue(
            { _id: '1', name: 'Alisson', lastname: 'Ferro', salary: 1234 },
        );
        User.findByIdAndUpdate({
            _id: 1, name: 'Alisson 2', lastname: 'Ferro 2', salary: 12345
        })
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        app.close();
    });
    
    it('Deve retornar status 404 se não encontrar o usuário', async() => {
        const userData = { name: 'Alisson 2', lastname: 'Ferro 2', salary: 12345 };
        const res = await request(app).put('/api/user/2').send(userData);
        
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/User not found/);
    });

    it('Deve retornar status 400 caso name não seja enviado', async () => {
        const userData = { lastname: "Ferro 2", salary: 12345 };
        const res = await request(app).put('/api/user/1').send(userData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Name is require/)
    });
    it('Deve retornar status 400 caso lastname não seja enviado', async () => {
        const userData = { name: "Alisson 2", salary: 12345 };
        const res = await request(app).put('/api/user/1').send(userData);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Lastname is require/);
    });
    it('Deve retornar status 200 caso seja alterado os dados', async() => {
        const userData = { name: 'Alisson 2', lastname: 'Ferro 2', salary: 12345 };
        const res = await request(app).put('/api/user/1').send(userData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Alisson 2');
        expect(res.body).toHaveProperty('lastname', 'Ferro 2');
        expect(res.body).toHaveProperty('salary', 12345);
        expect(User.findById).toHaveBeenCalledWith('1');
    })
});

describe('DELETE by ID', () => {
    beforeEach(() => {
        User.findByIdAndDelete.mockResolvedValue(
            { _id: '1', name: 'Alisson', lastname: 'Ferro', salary: 1234 },
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        app.close();
    });
    it('Deve retornar status 404 se não encontrar o usuário', async() => {
        User.findById.mockResolvedValue(null);

        const res = await request(app).delete('/api/user/1');
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/User not found/);
    });
    it('Deve retornar status 200 se encontrar o usuário', async () => {
        User.findById.mockResolvedValue({_id: '1', name: 'Alisson', lastname: 'Ferro', salary: 1234});

        const res = await request(app).delete('/api/user/1');
        expect(res.status).toBe(200);
        expect(User.findByIdAndDelete).toHaveBeenCalled();
    })
})