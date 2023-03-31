import classnames from "classnames";
import React, { useContext, useState } from "react";

interface TabContextType {
  tabs?: string[];

  currentTab?: string;
}

const tabContext = React.createContext<TabContextType>({
  tabs: [],

  currentTab: "",
});

function Tabs({ children }: { children: React.ReactNode[] }) {
  const [context, setContext] = useState<TabContextType>({});

  const chil = React.Children.toArray(children);

  React.useEffect(() => {
    const _ = {
      tabs: chil.map((item) => {
        if (
          typeof item === "object" &&
          "type" in item &&
          item.type === Tabs.TabItem
        ) {
          return item.props.name;
        }
      }),

      currentTab: "",
    };

    [_.currentTab] = _.tabs;

    setContext(_);
  }, [chil, children]);

  return (
    <tabContext.Provider value={context}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-col sm:flex-row">
          {context?.tabs?.map((v, index) => (
            <button
              key={index}
              className={classnames(
                "text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none",

                context.currentTab === v
                  ? "text-blue-500 border-b-2 font-medium border-blue-500"
                  : ""
              )}
              onClick={() => {
                setContext({ ...context, currentTab: v });
              }}
              type="button"
            >
              {v}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-3">{chil}</div>
    </tabContext.Provider>
  );
}

const TabItem = function ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const context = useContext(tabContext);
  if (context.currentTab !== name) {
    return <div />;
  }
  return <div>{children}</div>;
};

Tabs.TabItem = TabItem;

export default Tabs;
