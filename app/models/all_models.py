import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression, Lasso, LogisticRegression
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.neural_network import MLPRegressor, MLPClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier

class Regressors(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return (pd.concat([x,y], axis=1))

    def Linear_Regression(self):
        try:
            linreg.fit(self.x, self.y)
            return [linreg, linreg.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Lasso_Regression(self):
        lasso = Lasso()
        try:
            lasso.fit(self.x, self.y)
            return [lasso, lasso.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Gradient_Boosting_Regressor(self):
        gbr = GradientBoostingRegressor()
        try:
            gbr.fit(self.x, self.y)
            return [gbr, gbr.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Support_Vector_Machine(self):
        svr = SVR()
        try:
            svr.fit(self.x, self.y)
            return [svr, svr.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Neural_Network(self):
        nn = MLPRegressor()
        try:
            nn.fit(self.x, self.y)
            return [nn, nn.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

class Classifiers(object):
    def __init__(self, x ,y):
        le = LabelEncoder()
        self.x = x
        self.y = le.fit_transform(y) #categorical
    def __str__(self):
        return pd.concat([self.x,self.y], axis=1)

    def Logistic_Regression(self):
        lr = LogisticRegression()
        try:
            lr.fit(self.x, self.y)
            return [lr, lr.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Support_Vector_Machine(self):
        svc = SVC()
        try:
            svc.fit(self.x, self.y)
            return [svc, svc.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def K_Nearest_Neighbors(self):
        knn = KNeighborsClassifier()
        try:
            knn.fit(self.x, self.y)
            return [knn, knn.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Random_Forests(self):
        rfc = RandomForestClassifier()
        try:
            rfc.fit(self.x, self.y)
            return [rfc, rfc.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

    def Neural_Network(self):
        nn = MLPClassifier(hidden_layer_sizes=(50, 50), learning_rate_init=0.01, batch_size='auto',
                           nesterovs_momentum=False)
        try:
            nn.fit(self.x, self.y)
            return [nn, nn.score(self.x, self.y)]
        except:
            raise Exception("Data is invalid for selected model!")

def get_models(x, y, regression = True):
    if regression:
        base = Regressors(x, y)
        attrs = [method_name for method_name in dir(base) if callable(getattr(base, method_name))][:5] #from stackoverflow
        formatted = [i.replace("_", " ") for i in attrs]
        return formatted, base
    else:
        base = Classifiers(x, y)
        attrs = [method_name for method_name in dir(base) if callable(getattr(base, method_name))][:5]  # from stackoverflow
        formatted = [i.replace("_", " ") for i in attrs]
        return formatted, base