import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.linear_model import LinearRegression, Lasso, LogisticRegression
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.neural_network import MLPRegressor, MLPClassifier
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.decomposition import PCA
from sklearn.metrics import confusion_matrix
from matplotlib import pyplot as plt
import warnings

## SETTINGS ##
warnings.filterwarnings("ignore")
plt.ioff()

#default test split
test_split = 0.2
random_state = 69 #keep results the same

class Regressors(object):
    def __init__(self, x, y, test_split):
        self.x = x
        self.y = y
        self.x_train, self.x_test, self.y_train, self.y_test = \
        train_test_split(x,y,test_size=test_split, random_state=random_state)
        self.regression = True
    def __str__(self):
        return (pd.concat([x,y], axis=1))

    def Linear_Regression(self):
        linreg = LinearRegression()
        try:
            linreg.fit(self.x_train, self.y_train)
            export_code('linreg')
            return [linreg, linreg.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Lasso_Regression(self):
        lasso = Lasso()
        try:
            lasso.fit(self.x_train, self.y_train)
            export_code('lassoreg')
            return [lasso, lasso.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Gradient_Boosting_Regressor(self):
        gbr = GradientBoostingRegressor()
        try:
            gbr.fit(self.x_train, self.y_train)
            export_code('gbr')
            return [gbr, gbr.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Support_Vector_Machine(self):
        svr = SVR()
        try:
            svr.fit(self.x_train, self.y_train)
            export_code('svr')
            return [svr, svr.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Neural_Network(self):
        nn = MLPRegressor(solver='lbfgs', random_state=0)
        try:
            nn.fit(self.x_train, self.y_train)
            export_code('nnr')
            return [nn, nn.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

class Classifiers(object):
    def __init__(self, x, y, test_split):
        self.le = LabelEncoder()
        self.x = x
        self.y = y
        self.x_train, self.x_test, self.y_train, self.y_test = \
            train_test_split(x, self.le.fit_transform(y), test_size=test_split,
                             random_state=random_state)
        self.regression = False
    def __str__(self):
        return pd.concat([self.x,self.y], axis=1)

    def Logistic_Regression(self):
        lr = LogisticRegression()
        try:
            lr.fit(self.x_train, self.y_train)
            export_code('logit')
            return [lr, lr.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Support_Vector_Machine(self):
        svc = SVC()
        try:
            svc.fit(self.x_train, self.y_train)
            export_code('svc')
            return [svc, svc.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def K_Nearest_Neighbors(self):
        knn = KNeighborsClassifier()
        try:
            knn.fit(self.x_train, self.y_train)
            export_code('knn')
            return [knn, knn.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Random_Forests(self):
        rfc = RandomForestClassifier()
        try:
            rfc.fit(self.x_train, self.y_train)
            export_code('rf')
            return [rfc, rfc.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Neural_Network(self):
        nn = MLPClassifier(solver='lbfgs', random_state=0)
        try:
            nn.fit(self.x_train, self.y_train)
            export_code('nnc')
            return [nn, nn.score(self.x_test, self.y_test)]
        except:
            raise Exception("Data is invalid for selected model!")

def get_relevant_dataset(x, y, dataset):
    '''
    :param x: list of strings of x-columns
    :param y: string with name of y-column
    :param dataset: pandas dataframe
    :return: x ndarray and y ndarray
    '''
    code = '''
    x = dataframe[{}]
    y = dataframe['{}']
    '''.format(x,y)
    with open('views/output/code.txt', 'a+') as file:
        file.write(code)
        file.close()
    assert(isinstance(x, (list,np.ndarray,np.array)))
    assert(isinstance(y, str))
    df_x = dataset[x]
    df_y = dataset[y]
    return df_x.values, df_y.values

def get_models(x_, y_, dataset, test_split=test_split, regression = True):
    (x,y) = get_relevant_dataset(x_, y_, dataset)
    if regression:
        base = Regressors(x, y, test_split)
        attrs = [method_name for method_name in dir(base) if callable(getattr(base, method_name))][:5] # from stackoverflow
        model_names = [i.replace("_", " ") for i in attrs]
        return model_names, base
    else:
        base = Classifiers(x, y, test_split)
        attrs = [method_name for method_name in dir(base) if callable(getattr(base, method_name))][:5]  # from stackoverflow
        model_names = [i.replace("_", " ") for i in attrs]
        return model_names, base

def run_model(model_name, base_class):
    is_regression = base_class.regression
    method_name = model_name.replace(" ","_").strip() #change back to method name
    actual_method = getattr(base_class, method_name)
    results = actual_method()
    clean_txt('views/output/code.txt')
    model_class = results[0]
    score = results[1]
    x_train, x_test, y_train, y_test = (base_class.x_train, base_class.x_test,
                                        base_class.y_train, base_class.y_test)

    # Saves two plots and returns the score
    if is_regression:
        reduced_x = PCA(n_components=1).fit_transform(x_test)
        preds = model_class.predict(x_test)
        actual = y_test

        # Plot Sklearn Learning Curve
        plt.figure()
        plot_learning_curve(model_class, "Learning Curve", x_train, y_train)
        plt.savefig("views/output/plot1.jpg", dpi=500)
        plt.close('all')

        # Plot Preds v. Actual
        plt.figure()
        plt.scatter(reduced_x, actual)
        plt.scatter(reduced_x, preds)
        plt.ylabel("Target")
        plt.xlabel("Principal Component Analysis of Inputs")
        plt.legend(['Actual', 'Predicted'])
        plt.savefig('views/output/plot2.jpg', dpi=500)
        plt.close('all')
        return score

    else:
        preds = model_class.predict(x_test)
        actual = y_test

        # Plot Sklearn Learning Curve
        plt.figure()
        plot_learning_curve(model_class, "Learning Curve", x_train, y_train)
        plt.savefig("views/output/plot1.jpg", dpi=500)
        plt.close('all')

        # Plot Confusion Matrix
        plt.figure()
        corr_mat = confusion_matrix(actual, preds)
        sns.heatmap(corr_mat)
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.title("Confusion Heatmap")
        plt.savefig("views/output/plot2.jpg", dpi=500)
        plt.close('all')
        return score

def predict(x, model_name, base_class):
    method_name = model_name.replace(" ",
                                     "_").strip()  # change back to method name
    actual_method = getattr(base_class, method_name)
    results = actual_method()
    model_class = results[0]
    initial_pred = model_class.predict(x)
    if not base_class.regression:
        return base_class.le.inverse_transform(initial_pred)
    else:
        return initial_pred

def clean_txt(fpath):
    with open(fpath) as file:
        txt = file.read()
    lines = txt.splitlines()
    cleaned = [i.strip() for i in lines]
    new = '\n'.join(cleaned)
    with open(fpath, 'w') as file:
        file.write(new)
        file.close()
    return

def export_code(model):
    filename = 'views/output/code.txt'
    if model == 'linreg':
        code = '''from sklearn.linear_model import LinearRegression
        model = LinearRegression()
        model.fit(x, y) # your x and y data here
        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()

    elif model == 'lassoreg':
        code = '''
        from sklearn.linear_model import Lasso

        model = Lasso()
        model.fit(x, y) # your x and y data here
        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'gbr':
        code = '''
                from sklearn.ensemble import GradientBoostingRegressor

                model = GradientBoostingRegressor()
                model.fit(x, y) # your x and y data here
                r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'svm':
        code = '''
                        from sklearn.svm import SVR

                        model = SVR()
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'nnr':
        code = '''
                        from sklearn.neural_network import MLPRegressor

                        model = MLPRegressor(solver='lbfgs', random_state=0)
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'logit':
        code = '''
                        from sklearn.linear_model import LogisticRegression

                        model = LogisticRegression()
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'svc':
        code = '''
                        from sklearn.svm import SVC

                        model = SVC()
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'knn':
        code = '''
                        from sklearn.neighbors import KNeighborsClassifier

                        model = KNeighborsClassifier()
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'rf':
        code = '''
            from sklearn.ensemble import RandomForestClassifier

            model = RandomForestClassifier()
            model.fit(x, y) # your x and y data here
            r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    elif model == 'nnc':
        code = '''
                        from sklearn.neural_network import MLPClassifier

                        model = MLPClassifer(solver='lbfgs', random_state=0)
                        model.fit(x, y) # your x and y data here
                        r_2_score = model.score(x, y) # r^2 score of the trained model'''
        with open(filename, 'a+') as file:
            file.write(code)
            file.close()
    else:
        print('you fucked up')

# ---- From SciKit-Learn ---- #
def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None,
                        n_jobs=1, train_sizes=np.linspace(.1, 1.0, 5)):
    plt.title(title)
    if ylim is not None:
        plt.ylim(*ylim)
    plt.xlabel("Training examples")
    plt.ylabel("Score")
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    plt.grid()

    plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                     train_scores_mean + train_scores_std, alpha=0.1,
                     color="r")
    plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                     test_scores_mean + test_scores_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r",
             label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g",
             label="Cross-validation score")

    plt.legend(loc="best")
    return plt