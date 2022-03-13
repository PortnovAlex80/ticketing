import mognoose from 'mongoose';
import { app} from "./app";

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('Secret failed JWT_KEY');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined!');
    }

    try {
        await mognoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successful')
             } catch (err) {
        console.log(err)
    }

    app.listen(3000, () => {
        console.log('auth service listening on port 3000');
    });
};

start();

///https://kubernetes.io/ru/docs/setup/learning-environment/minikube/


